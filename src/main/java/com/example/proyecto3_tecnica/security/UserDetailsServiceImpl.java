package org.example.proyecto3_tecnica.security;

import lombok.AllArgsConstructor;
import org.example.proyecto3_tecnica.models.entities.Usuario;
import org.example.proyecto3_tecnica.repository.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;
@AllArgsConstructor
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UsuarioRepository usuarioRepository;



    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        Usuario usuario = usuarioRepository.findByUsernameAndActivoTrue(username).orElseThrow(() ->
                new UsernameNotFoundException("Usuario no encontrado: " + username)
        );

        return User.withUsername(usuario.getUsername())
                .password(usuario.getPassword())
                .authorities(List.of(
                        new SimpleGrantedAuthority(usuario.getRol().getNombre())))
                .disabled(!usuario.isActivo())
                .build();
    }
}