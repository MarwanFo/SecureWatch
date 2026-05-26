package com.securewatch.modules.monitoring.service;

import com.securewatch.modules.monitoring.model.AuditLog;
import com.securewatch.modules.monitoring.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    private static final String GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000";

    @Transactional
    public AuditLog createLog(UUID tenantId, UUID userId, String action, String resource,
                              String ipAddress, String userAgent, String result, int durationMs) {

        // Chaînage cryptographique : récupérer le hash précédent
        String previousHash = auditLogRepository.findLatestByTenantId(tenantId)
                .map(AuditLog::getLogHash)
                .orElse(GENESIS_HASH);

        Instant now = Instant.now();

        // Concaténation des champs pour le calcul du hash
        String data = String.join("|",
                tenantId.toString(),
                userId != null ? userId.toString() : "SYSTEM",
                action,
                result,
                now.toString(),
                previousHash
        );

        String currentHash = sha256(data);

        AuditLog log = AuditLog.builder()
                .tenantId(tenantId)
                .userId(userId)
                .action(action)
                .resource(resource)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .result(result)
                .durationMs(durationMs)
                .logHash(currentHash)
                .previousHash(previousHash)
                .timestamp(now)
                .build();

        return auditLogRepository.save(log);
    }

    public Page<AuditLog> getLogsByTenant(UUID tenantId, Pageable pageable) {
        return auditLogRepository.findByTenantIdOrderByTimestampDesc(tenantId, pageable);
    }

    /**
     * Vérifie l'intégrité de la chaîne de logs pour un tenant.
     * Retourne l'index du premier log corrompu, ou -1 si la chaîne est intacte.
     */
    public int verifyChainIntegrity(UUID tenantId) {
        Page<AuditLog> allLogs = auditLogRepository.findByTenantIdOrderByTimestampDesc(
                tenantId, Pageable.unpaged());

        var logs = allLogs.getContent();
        // Parcourir du plus ancien au plus récent
        for (int i = logs.size() - 1; i > 0; i--) {
            AuditLog current = logs.get(i - 1);
            AuditLog previous = logs.get(i);
            if (!current.getPreviousHash().equals(previous.getLogHash())) {
                return logs.size() - (i - 1);
            }
        }
        return -1; // chaîne intacte
    }

    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}
