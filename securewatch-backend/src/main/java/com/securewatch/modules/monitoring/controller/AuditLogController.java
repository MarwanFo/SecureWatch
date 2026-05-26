package com.securewatch.modules.monitoring.controller;

import com.securewatch.modules.monitoring.model.AuditLog;
import com.securewatch.modules.monitoring.service.AuditLogService;
import com.securewatch.shared.dto.ApiResponse;
import com.securewatch.shared.dto.PaginationInfo;
import com.securewatch.shared.util.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("No tenant context found."));
        }

        Page<AuditLog> logs = auditLogService.getLogsByTenant(tenantId, PageRequest.of(page, size));

        PaginationInfo pagination = PaginationInfo.builder()
                .currentPage(logs.getNumber())
                .pageSize(logs.getSize())
                .totalElements(logs.getTotalElements())
                .totalPages(logs.getTotalPages())
                .build();

        return ResponseEntity.ok(ApiResponse.ok(logs.getContent(), pagination));
    }

    @GetMapping("/verify-integrity")
    public ResponseEntity<ApiResponse<?>> verifyIntegrity() {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("No tenant context found."));
        }

        int corruptedIndex = auditLogService.verifyChainIntegrity(tenantId);
        boolean isIntact = corruptedIndex == -1;

        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "chainIntact", isIntact,
                "corruptedAtIndex", corruptedIndex
        )));
    }
}
