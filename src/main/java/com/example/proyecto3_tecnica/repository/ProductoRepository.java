package org.example.proyecto3_tecnica.repository;

import org.example.proyecto3_tecnica.models.entities.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository
        extends JpaRepository<Producto, Long> {
    boolean existsByCategoriaId(Long categoriaId);
}