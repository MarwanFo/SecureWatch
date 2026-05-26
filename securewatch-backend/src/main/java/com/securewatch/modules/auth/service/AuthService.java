package com.securewatch.modules.auth.service;

import com.securewatch.modules.auth.dto.*;
import com.securewatch.modules.auth.model.Tenant;
import com.securewatch.modules.auth.model.User;
import com.securewatch.modules.auth.model.UserRole;
import com.securewatch.modules.auth.repository.TenantRepository;
import com.securewatch.modules.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public User registerTenant(RegisterRequest request) {
        if (tenantRepository.findBySubdomain(request.getSubdomain()).isPresent()) {
            throw new IllegalArgumentException("Ce sous-domaine est déjà réservé.");
        }

        Tenant tenant = Tenant.builder()
                .nom(request.getNomTenant())
                .subdomain(request.getSubdomain())
                .isActive(true)
                .build();
        tenant = tenantRepository.save(tenant);

        User admin = User.builder()
                .tenant(tenant)
                .nom(request.getAdminNom())
                .email(request.getAdminEmail())
                .passwordHash(passwordEncoder.encode(request.getAdminPassword()))
                .role(UserRole.ADMIN)
                .emailVerified(true)
                .isActive(true)
                .build();
        return userRepository.save(admin);
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByTenantSubdomainAndEmail(request.getSubdomain(), request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Identifiants incorrects ou organisation inexistante."));

        if (!user.isActive()) {
            throw new IllegalStateException("Ce compte utilisateur a été désactivé.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Identifiants incorrects ou organisation inexistante.");
        }

        if (user.isMfaEnabled()) {
            // Le flux MFA exige une étape supplémentaire de validation du code OTP
            return LoginResponse.builder()
                    .mfaRequired(true)
                    .nom(user.getNom())
                    .role(user.getRole().name())
                    .userId(user.getId().toString())
                    .build();
        }

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .mfaRequired(false)
                .nom(user.getNom())
                .role(user.getRole().name())
                .userId(user.getId().toString())
                .build();
    }

    public LoginResponse refresh(RefreshRequest request) {
        String token = request.getRefreshToken();
        if (!jwtService.validateToken(token)) {
            throw new IllegalArgumentException("Token de rafraîchissement invalide ou expiré.");
        }

        String email = jwtService.getEmailFromToken(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé."));

        if (!user.isActive()) {
            throw new IllegalStateException("Ce compte utilisateur a été désactivé.");
        }

        String newAccessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);

        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .mfaRequired(false)
                .nom(user.getNom())
                .role(user.getRole().name())
                .build();
    }
}
