package com.securewatch.modules.alert.repository;

import com.securewatch.modules.alert.model.Alert;
import com.securewatch.modules.alert.model.AlertSeverity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AlertRepository extends JpaRepository<Alert, UUID> {
    Page<Alert> findByTenantIdOrderByTimestampDesc(UUID tenantId, Pageable pageable);
    Page<Alert> findByTenantIdAndSeverityOrderByTimestampDesc(UUID tenantId, AlertSeverity severity, Pageable pageable);
    long countByTenantIdAndIsAcknowledgedFalse(UUID tenantId);
    long countByTenantIdAndSeverityAndIsAcknowledgedFalse(UUID tenantId, AlertSeverity severity);
}
