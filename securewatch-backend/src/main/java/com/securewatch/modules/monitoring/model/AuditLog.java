package com.securewatch.modules.monitoring.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "log_id")
    private UUID logId;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "user_id")
    private UUID userId;

    @Column(nullable = false, length = 100)
    private String action;

    @Column(nullable = false, length = 255)
    private String resource;

    @Column(name = "ip_address", nullable = false, columnDefinition = "INET")
    private String ipAddress;

    @Column(name = "user_agent", nullable = false, columnDefinition = "TEXT")
    private String userAgent;

    @Column(nullable = false, length = 50)
    private String result;

    @Column(name = "duration_ms", nullable = false)
    private int durationMs;

    @Column(name = "log_hash", nullable = false, length = 64)
    private String logHash;

    @Column(name = "previous_hash", nullable = false, length = 64)
    private String previousHash;

    @Column(name = "timestamp", nullable = false, updatable = false)
    @Builder.Default
    private Instant timestamp = Instant.now();
}
