package org.example.proyecto3_tecnica.models.dto.categoria;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoriaRequestDTO {

    @NotBlank
    private String nombre;
    private String descripcion;
}

