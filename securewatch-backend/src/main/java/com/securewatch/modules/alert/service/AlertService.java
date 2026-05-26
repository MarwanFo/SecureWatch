package com.securewatch.modules.alert.service;

import com.securewatch.modules.alert.model.Alert;
import com.securewatch.modules.alert.model.AlertSeverity;
import com.securewatch.modules.alert.repository.AlertRepository;
import com.securewatch.shared.dto.ApiResponse;
import com.securewatch.shared.dto.PaginationInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;

    @Transactional
    public Alert createAlert(UUID tenantId, UUID userId, UUID sessionId,
                             AlertSeverity severity, String type, String title,
                             String description, int riskScore) {

        Alert alert = Alert.builder()
                .tenantId(tenantId)
                .userId(userId)
                .sessionId(sessionId)
                .severity(severity)
                .type(type)
                .title(title)
                .description(description)
                .riskScore(riskScore)
                .timestamp(Instant.now())
                .build();

        return alertRepository.save(alert);
    }

    public Page<Alert> getAlerts(UUID tenantId, AlertSeverity severity, int page, int size) {
        if (severity != null) {
            return alertRepository.findByTenantIdAndSeverityOrderByTimestampDesc(
                    tenantId, severity, PageRequest.of(page, size));
        }
        return alertRepository.findByTenantIdOrderByTimestampDesc(tenantId, PageRequest.of(page, size));
    }

    @Transactional
    public boolean acknowledgeAlert(UUID alertId, UUID acknowledgedBy) {
        return alertRepository.findById(alertId).map(alert -> {
            alert.setAcknowledged(true);
            alert.setAcknowledgedBy(acknowledgedBy);
            alertRepository.save(alert);
            return true;
        }).orElse(false);
    }

    public long countUnacknowledged(UUID tenantId) {
        return alertRepository.countByTenantIdAndIsAcknowledgedFalse(tenantId);
    }

    public long countCriticalUnacknowledged(UUID tenantId) {
        return alertRepository.countByTenantIdAndSeverityAndIsAcknowledgedFalse(tenantId, AlertSeverity.CRITICAL);
    }
}
