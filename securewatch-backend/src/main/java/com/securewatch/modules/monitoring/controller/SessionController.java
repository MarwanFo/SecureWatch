package com.securewatch.modules.monitoring.controller;

import com.securewatch.modules.monitoring.model.Session;
import com.securewatch.modules.monitoring.service.SessionService;
import com.securewatch.shared.dto.ApiResponse;
import com.securewatch.shared.dto.PaginationInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @GetMapping("/active/{userId}")
    public ResponseEntity<ApiResponse<?>> getActiveSessions(@PathVariable UUID userId) {
        List<Session> sessions = sessionService.getActiveSessions(userId);
        return ResponseEntity.ok(ApiResponse.ok(sessions));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<ApiResponse<?>> getSessionHistory(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Page<Session> sessions = sessionService.getSessionHistory(userId, PageRequest.of(page, size));

        PaginationInfo pagination = PaginationInfo.builder()
                .currentPage(sessions.getNumber())
                .pageSize(sessions.getSize())
                .totalElements(sessions.getTotalElements())
                .totalPages(sessions.getTotalPages())
                .build();

        return ResponseEntity.ok(ApiResponse.ok(sessions.getContent(), pagination));
    }

    @PostMapping("/{sessionId}/terminate")
    public ResponseEntity<ApiResponse<?>> terminateSession(@PathVariable UUID sessionId) {
        boolean success = sessionService.terminateSession(sessionId);
        if (success) {
            return ResponseEntity.ok(ApiResponse.ok(Map.of("terminated", true)));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/count/active")
    public ResponseEntity<ApiResponse<?>> countActive() {
        long count = sessionService.countActiveSessions();
        return ResponseEntity.ok(ApiResponse.ok(Map.of("activeSessions", count)));
    }
}
