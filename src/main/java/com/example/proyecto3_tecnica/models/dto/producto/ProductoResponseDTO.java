package org.example.proyecto3_tecnica.models.dto.producto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
public class ProductoResponseDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer cantidadStock;
    private Long categoriaId;
    private String categoriaNombre;
}