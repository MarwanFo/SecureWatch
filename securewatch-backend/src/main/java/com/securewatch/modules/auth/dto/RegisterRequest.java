package com.securewatch.modules.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "Le nom du tenant est requis")
    @Size(max = 100)
    private String nomTenant;

    @NotBlank(message = "Le sous-domaine est requis")
    @Size(max = 50)
    private String subdomain;

    @NotBlank(message = "Le nom de l'administrateur est requis")
    @Size(max = 100)
    private String adminNom;

    @NotBlank(message = "L'email de l'administrateur est requis")
    @Email(message = "Format d'email invalide")
    private String adminEmail;

    @NotBlank(message = "Le mot de passe de l'administrateur est requis")
    @Size(min = 8, message = "Le mot de passe doit faire au moins 8 caractères")
    private String adminPassword;
}
