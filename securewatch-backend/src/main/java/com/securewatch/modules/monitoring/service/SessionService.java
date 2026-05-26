package com.securewatch.modules.monitoring.service;

import com.securewatch.modules.monitoring.model.Session;
import com.securewatch.modules.monitoring.model.SessionStatus;
import com.securewatch.modules.monitoring.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SessionService {

    private final SessionRepository sessionRepository;

    @Transactional
    public Session createSession(UUID userId, String ipAddress, String userAgent, String jwtJti, Instant expiresAt) {
        Session session = Session.builder()
                .userId(userId)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .jwtJti(jwtJti)
                .expiresAt(expiresAt)
                .statut(SessionStatus.ACTIVE)
                .riskScore(0)
                .build();

        return sessionRepository.save(session);
    }

    public void enrichWithGeoData(UUID sessionId, String country, String city, BigDecimal lat, BigDecimal lon) {
        sessionRepository.findById(sessionId).ifPresent(session -> {
            session.setCountry(country);
            session.setCity(city);
            session.setLatitude(lat);
            session.setLongitude(lon);
            sessionRepository.save(session);
        });
    }

    public List<Session> getActiveSessions(UUID userId) {
        return sessionRepository.findByUserIdAndStatut(userId, SessionStatus.ACTIVE);
    }

    public Page<Session> getSessionHistory(UUID userId, Pageable pageable) {
        return sessionRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    @Transactional
    public boolean terminateSession(UUID sessionId) {
        return sessionRepository.findById(sessionId).map(session -> {
            session.setStatut(SessionStatus.TERMINATED);
            session.setTerminatedAt(Instant.now());
            sessionRepository.save(session);
            return true;
        }).orElse(false);
    }

    @Transactional
    public void markSuspicious(UUID sessionId, int riskScore) {
        sessionRepository.findById(sessionId).ifPresent(session -> {
            session.setStatut(SessionStatus.SUSPICIOUS);
            session.setRiskScore(riskScore);
            sessionRepository.save(session);
            log.warn("Session {} marked as SUSPICIOUS with risk score {}", sessionId, riskScore);
        });
    }

    public long countActiveSessions() {
        return sessionRepository.countByStatut(SessionStatus.ACTIVE);
    }
}
