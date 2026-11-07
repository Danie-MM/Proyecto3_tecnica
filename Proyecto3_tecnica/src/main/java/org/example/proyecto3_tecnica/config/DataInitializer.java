package org.example.proyecto3_tecnica.config;

import org.example.proyecto3_tecnica.models.entities.Rol;
import org.example.proyecto3_tecnica.models.entities.Usuario;
import org.example.proyecto3_tecnica.repository.RolRepository;
import org.example.proyecto3_tecnica.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    public static final String SUPER_ADMIN_ROLE = "SUPER-ADMIN-ROLE";
    public static final String USER_ROLE = "USER";

    @Bean
    public CommandLineRunner inicializarDatos(RolRepository rolRepository, UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        return args -> {

            Rol superAdminRole = rolRepository.findByNombre(SUPER_ADMIN_ROLE).orElseGet(() -> {
                Rol rol = new Rol();
                rol.setNombre(SUPER_ADMIN_ROLE);
                return rolRepository.save(rol);
            });

            Rol userRole = rolRepository.findByNombre(USER_ROLE).orElseGet(() -> {
                Rol rol = new Rol();
                rol.setNombre(USER_ROLE);
                return rolRepository.save(rol);
            });

            if (!usuarioRepository.existsByUsername("superadmin")) {
                Usuario superAdmin = new Usuario();
                superAdmin.setUsername("superadmin");
                superAdmin.setPassword(passwordEncoder.encode("Admin123*"));
                superAdmin.setActivo(true);
                superAdmin.setRol(superAdminRole);
                usuarioRepository.save(superAdmin);
            }

            if (!usuarioRepository.existsByUsername("usuario")) {
                Usuario usuario = new Usuario();
                usuario.setUsername("usuario");
                usuario.setPassword(passwordEncoder.encode("User123*"));
                usuario.setActivo(true);
                usuario.setRol(userRole);
                usuarioRepository.save(usuario);
            }
        };
    }
}
