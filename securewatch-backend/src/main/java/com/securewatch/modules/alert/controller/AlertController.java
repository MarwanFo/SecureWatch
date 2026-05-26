package com.securewatch.modules.alert.controller;

import com.securewatch.modules.alert.model.Alert;
import com.securewatch.modules.alert.model.AlertSeverity;
import com.securewatch.modules.alert.service.AlertService;
import com.securewatch.shared.dto.ApiResponse;
import com.securewatch.shared.dto.PaginationInfo;
import com.securewatch.shared.util.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAlerts(
            @RequestParam(required = false) AlertSeverity severity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("No tenant context."));
        }

        Page<Alert> alerts = alertService.getAlerts(tenantId, severity, page, size);

        PaginationInfo pagination = PaginationInfo.builder()
                .currentPage(alerts.getNumber())
                .pageSize(alerts.getSize())
                .totalElements(alerts.getTotalElements())
                .totalPages(alerts.getTotalPages())
                .build();

        return ResponseEntity.ok(ApiResponse.ok(alerts.getContent(), pagination));
    }

    @PostMapping("/{alertId}/acknowledge")
    public ResponseEntity<ApiResponse<?>> acknowledge(
            @PathVariable UUID alertId,
            @RequestParam UUID acknowledgedBy) {

        boolean success = alertService.acknowledgeAlert(alertId, acknowledgedBy);
        if (success) {
            return ResponseEntity.ok(ApiResponse.ok(Map.of("acknowledged", true)));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<?>> getStats() {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("No tenant context."));
        }

        long total = alertService.countUnacknowledged(tenantId);
        long critical = alertService.countCriticalUnacknowledged(tenantId);

        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "unacknowledgedTotal", total,
                "unacknowledgedCritical", critical
        )));
    }
}
