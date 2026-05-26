package com.securewatch.modules.monitoring.controller;

import com.securewatch.modules.alert.model.AlertSeverity;
import com.securewatch.modules.alert.repository.AlertRepository;
import com.securewatch.modules.alert.model.IncidentStatus;
import com.securewatch.modules.alert.repository.IncidentRepository;
import com.securewatch.modules.monitoring.model.AuditLog;
import com.securewatch.modules.monitoring.model.SessionStatus;
import com.securewatch.modules.monitoring.repository.AuditLogRepository;
import com.securewatch.modules.monitoring.repository.SessionRepository;
import com.securewatch.shared.dto.ApiResponse;
import com.securewatch.shared.util.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final SessionRepository sessionRepository;
    private final AlertRepository alertRepository;
    private final IncidentRepository incidentRepository;
    private final AuditLogRepository auditLogRepository;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<?>> getStats() {
        UUID tenantId = TenantContext.getTenantId();

        // Sessions
        long activeSessions = sessionRepository.countByStatut(SessionStatus.ACTIVE);
        long suspiciousSessions = sessionRepository.countByStatut(SessionStatus.SUSPICIOUS);

        // Alerts
        long unresolvedAlerts = tenantId != null
                ? alertRepository.countByTenantIdAndIsAcknowledgedFalse(tenantId)
                : 0;
        long criticalAlerts = tenantId != null
                ? alertRepository.countByTenantIdAndSeverityAndIsAcknowledgedFalse(tenantId, AlertSeverity.CRITICAL)
                : 0;
        long totalAlerts = alertRepository.count();

        // Incidents
        long openIncidents = tenantId != null
                ? incidentRepository.countByTenantIdAndStatusNot(tenantId, IncidentStatus.ARCHIVED)
                : 0;

        // Logs
        long totalLogs = auditLogRepository.count();

        // Security Health Index = basic formula based on ratios
        double healthIndex = 100.0;
        if (totalAlerts > 0) {
            healthIndex -= (unresolvedAlerts * 2.0);
        }
        if (suspiciousSessions > 0) {
            healthIndex -= (suspiciousSessions * 5.0);
        }
        healthIndex = Math.max(0.0, Math.min(100.0, healthIndex));

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("securityHealthIndex", Math.round(healthIndex * 10.0) / 10.0);
        stats.put("activeSessions", activeSessions);
        stats.put("suspiciousSessions", suspiciousSessions);
        stats.put("unresolvedAlerts", unresolvedAlerts);
        stats.put("criticalAlerts", criticalAlerts);
        stats.put("totalAlerts", totalAlerts);
        stats.put("openIncidents", openIncidents);
        stats.put("totalLogs", totalLogs);

        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/recent-logs")
    public ResponseEntity<ApiResponse<?>> getRecentLogs() {
        UUID tenantId = TenantContext.getTenantId();
        List<AuditLog> logs;

        if (tenantId != null) {
            logs = auditLogRepository.findByTenantIdOrderByTimestampDesc(tenantId, PageRequest.of(0, 5)).getContent();
        } else {
            logs = auditLogRepository.findAll(PageRequest.of(0, 5)).getContent();
        }

        return ResponseEntity.ok(ApiResponse.ok(logs));
    }
}
