package org.example.proyecto3_tecnica.models.dto.producto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
public class ProductoRequestDTO {

    @NotBlank(message = "El nombre es necesario.")
    @Size(max = 150, message = "El nombre debe ser menor a 150 caracteres")
    private String nombre;

    @Size(max = 500, message = "la descripción debe ser menor a 500 caracteres")
    private String descripcion;


    @NotNull(message = "Se necesita el precio")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
    private BigDecimal precio;

    @NotNull(message = "La cantidad en stock es necesaria")
    @Min(value = 0, message = "La cantidad no debe ser negativa")
    private Integer cantidadStock;

    @NotNull(message = "La categoría es necesaria")
    @Positive(message = "El id debe ser válido")
    private Long categoriaId;
}