package com.securewatch.modules.monitoring.repository;

import com.securewatch.modules.monitoring.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
    Page<AuditLog> findByTenantIdOrderByTimestampDesc(UUID tenantId, Pageable pageable);

    @Query("SELECT l FROM AuditLog l WHERE l.tenantId = :tenantId ORDER BY l.timestamp DESC LIMIT 1")
    Optional<AuditLog> findLatestByTenantId(UUID tenantId);
}
