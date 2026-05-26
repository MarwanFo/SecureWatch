package com.securewatch.modules.auth.controller;

import com.securewatch.modules.auth.dto.LoginResponse;
import com.securewatch.modules.auth.model.User;
import com.securewatch.modules.auth.repository.UserRepository;
import com.securewatch.modules.auth.service.JwtService;
import com.securewatch.modules.auth.service.MfaService;
import com.securewatch.shared.dto.ApiResponse;
import com.securewatch.shared.util.EncryptionUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth/mfa")
@RequiredArgsConstructor
@CrossOrigin
public class MfaController {

    private final MfaService mfaService;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final EncryptionUtil encryptionUtil;

    @PostMapping("/setup")
    public ResponseEntity<ApiResponse<?>> setupMfa(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        String secret = mfaService.setupMfa(user);
        String qrUrl = mfaService.getQrCodeUrl(secret, user.getEmail());

        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "secret", secret,
                "qrCodeUrl", qrUrl
        )));
    }

    @PostMapping("/enable")
    public ResponseEntity<ApiResponse<?>> enableMfa(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        
        String code = body.get("code");
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        boolean success = mfaService.enableMfa(user, code);
        if (success) {
            return ResponseEntity.ok(ApiResponse.ok("MFA activé avec succès."));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error("Code de validation incorrect."));
        }
    }

    @PostMapping("/disable")
    public ResponseEntity<ApiResponse<?>> disableMfa(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        mfaService.disableMfa(user);
        return ResponseEntity.ok(ApiResponse.ok("MFA désactivé avec succès."));
    }

    @PostMapping("/verify-login")
    public ResponseEntity<?> verifyLogin(@RequestBody Map<String, String> body) {
        String userIdStr = body.get("userId");
        String code = body.get("code");

        if (userIdStr == null || code == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Paramètres requis manquants."));
        }

        UUID userId = UUID.fromString(userIdStr);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        if (!user.isMfaEnabled() || user.getMfaSecret() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Le MFA n'est pas configuré pour cet utilisateur."));
        }

        String decryptedSecret = encryptionUtil.decrypt(user.getMfaSecret());
        if (mfaService.verifyCode(decryptedSecret, code)) {
            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            return ResponseEntity.ok(LoginResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .mfaRequired(false)
                    .nom(user.getNom())
                    .role(user.getRole().name())
                    .userId(user.getId().toString())
                    .build());
        } else {
            return ResponseEntity.status(401).body(ApiResponse.error("Code MFA incorrect."));
        }
    }
}
