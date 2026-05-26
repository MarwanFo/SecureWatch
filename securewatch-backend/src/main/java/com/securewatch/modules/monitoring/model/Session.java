package com.securewatch.modules.monitoring.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "session_id")
    private UUID sessionId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "ip_address", nullable = false, columnDefinition = "INET")
    private String ipAddress;

    @Column(name = "user_agent", nullable = false, columnDefinition = "TEXT")
    private String userAgent;

    @Column(length = 2)
    private String country;

    @Column(length = 100)
    private String city;

    @Column(precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(precision = 9, scale = 6)
    private BigDecimal longitude;

    @Column(name = "statut", nullable = false, columnDefinition = "session_status")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SessionStatus statut = SessionStatus.ACTIVE;

    @Column(name = "risk_score")
    @Builder.Default
    private int riskScore = 0;

    @Column(name = "jwt_jti", nullable = false, unique = true)
    private String jwtJti;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "terminated_at")
    private Instant terminatedAt;
}
