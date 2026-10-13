package org.example.proyecto3_tecnica.service;

import lombok.RequiredArgsConstructor;
import org.example.proyecto3_tecnica.models.dto.auth.JwtResponseDTO;
import org.example.proyecto3_tecnica.models.dto.auth.LoginRequestDTO;
import org.example.proyecto3_tecnica.models.dto.auth.RegistroRequestDTO;
import org.example.proyecto3_tecnica.models.dto.usuario.UsuarioResponseDTO;
import org.example.proyecto3_tecnica.models.entities.Rol;
import org.example.proyecto3_tecnica.models.entities.Usuario;
import org.example.proyecto3_tecnica.repository.RolRepository;
import org.example.proyecto3_tecnica.repository.UsuarioRepository;
import org.example.proyecto3_tecnica.security.JwtService;
import org.example.proyecto3_tecnica.security.UserDetailsServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String ROL_USUARIO = "USER";
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;


    public JwtResponseDTO iniciarSesion(LoginRequestDTO request) {
        String username = request.getUsername().trim();

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                username,
                request.getPassword())
        );

        UserDetails userDetails = userDetailsService
                .loadUserByUsername(username);

        Usuario usuario = usuarioRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "El usuario no fue encontrado.")
                );

        String token = jwtService.generarToken(userDetails);

        return new JwtResponseDTO(token, usuario.getUsername(),
                usuario.getRol()
                        .getNombre()
        );
    }

    @Transactional
    public UsuarioResponseDTO registrarUsuario(
            RegistroRequestDTO request
    ) {
        String username = request.getUsername().trim();

        if (usuarioRepository
                .existsByUsernameIgnoreCase(username)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe un usuario con ese nombre."
            );
        }

        Rol rolUsuario = rolRepository.findByNombre(ROL_USUARIO)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.INTERNAL_SERVER_ERROR,
                                "El rol USER no está configurado.")
                );

        Usuario usuario = new Usuario();

        usuario.setUsername(username);

        usuario.setPassword(passwordEncoder.encode(request.getPassword()));

        usuario.setActivo(true);

        usuario.setRol(rolUsuario);

        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        return convertirAResponse(usuarioGuardado);
    }


    private UsuarioResponseDTO convertirAResponse(Usuario usuario) {
        return new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getUsername(),
                usuario.isActivo(),
                usuario.getRol().getNombre()
        );
    }
}