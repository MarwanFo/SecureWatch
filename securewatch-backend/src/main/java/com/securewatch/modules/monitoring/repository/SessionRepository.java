package com.securewatch.modules.monitoring.repository;

import com.securewatch.modules.monitoring.model.Session;
import com.securewatch.modules.monitoring.model.SessionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SessionRepository extends JpaRepository<Session, UUID> {
    List<Session> findByUserIdAndStatut(UUID userId, SessionStatus statut);
    Page<Session> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
    Optional<Session> findByJwtJti(String jwtJti);
    long countByStatut(SessionStatus statut);
}
