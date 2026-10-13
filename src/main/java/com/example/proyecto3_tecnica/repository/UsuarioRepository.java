package org.example.proyecto3_tecnica.repository;

import org.example.proyecto3_tecnica.models.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository
        extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(
            String username
    );

    Optional<Usuario> findByUsernameAndActivoTrue(
            String username
    );

    boolean existsByUsername(
            String username
    );

    boolean existsByUsernameIgnoreCase(
            String username
    );
    Optional<Usuario> findByUsernameIgnoreCase(
            String username
    );
}