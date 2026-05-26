package com.securewatch.modules.alert.repository;

import com.securewatch.modules.alert.model.Incident;
import com.securewatch.modules.alert.model.IncidentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, UUID> {
    Page<Incident> findByTenantIdOrderByCreatedAtDesc(UUID tenantId, Pageable pageable);
    Page<Incident> findByTenantIdAndStatusOrderByCreatedAtDesc(UUID tenantId, IncidentStatus status, Pageable pageable);
    long countByTenantIdAndStatusNot(UUID tenantId, IncidentStatus status);
}
