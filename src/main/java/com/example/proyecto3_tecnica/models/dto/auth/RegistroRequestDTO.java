package org.example.proyecto3_tecnica.models.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RegistroRequestDTO {

    @NotBlank(message = "El nombre de usuario es necesario.")
    @Size(min = 4, max = 100, message = "El nombre debe estar entre 4 y 100 caracteres")
    private String username;

    @NotBlank(message = "Necesita ingresar una contraseña.")
    @Size(min = 8, max = 100, message = "La contraseña debe estar entre 8 y 100 caracteres")
    private String password;
}