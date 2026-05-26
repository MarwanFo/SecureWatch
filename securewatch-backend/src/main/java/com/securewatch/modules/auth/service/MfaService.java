package com.securewatch.modules.auth.service;

import com.securewatch.modules.auth.model.User;
import com.securewatch.modules.auth.repository.UserRepository;
import com.securewatch.shared.util.EncryptionUtil;
import lombok.RequiredArgsConstructor;
import org.jboss.aerogear.security.otp.Totp;
import org.jboss.aerogear.security.otp.api.Base32;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class MfaService {

    private final EncryptionUtil encryptionUtil;
    private final UserRepository userRepository;

    public String generateSecret() {
        return Base32.random();
    }

    public String getQrCodeUrl(String secret, String email) {
        String issuer = "SecureWatch";
        return String.format("otpauth://totp/%s:%s?secret=%s&issuer=%s",
                URLEncoder.encode(issuer, StandardCharsets.UTF_8),
                URLEncoder.encode(email, StandardCharsets.UTF_8),
                secret,
                URLEncoder.encode(issuer, StandardCharsets.UTF_8));
    }

    public boolean verifyCode(String secret, String code) {
        if (code == null || code.trim().isEmpty()) return false;
        try {
            Totp totp = new Totp(secret);
            return totp.verify(code);
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    public String setupMfa(User user) {
        String rawSecret = generateSecret();
        String encryptedSecret = encryptionUtil.encrypt(rawSecret);
        user.setMfaSecret(encryptedSecret);
        userRepository.save(user);
        return rawSecret;
    }

    @Transactional
    public boolean enableMfa(User user, String code) {
        if (user.getMfaSecret() == null) return false;
        String decryptedSecret = encryptionUtil.decrypt(user.getMfaSecret());
        if (verifyCode(decryptedSecret, code)) {
            user.setMfaEnabled(true);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    @Transactional
    public void disableMfa(User user) {
        user.setMfaEnabled(false);
        user.setMfaSecret(null);
        userRepository.save(user);
    }
}
