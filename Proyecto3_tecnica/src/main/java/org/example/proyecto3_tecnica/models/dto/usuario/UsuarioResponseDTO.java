package org.example.proyecto3_tecnica.models.dto.usuario;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponseDTO {

    private Long id;
    private String username;
    private boolean activo;
    private String rol;

    public void setRolNombre(String nombre) {
    }
}