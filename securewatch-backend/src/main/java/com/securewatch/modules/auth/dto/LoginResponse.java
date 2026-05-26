package com.securewatch.modules.auth.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private boolean mfaRequired;
    private String role;
    private String nom;
}
