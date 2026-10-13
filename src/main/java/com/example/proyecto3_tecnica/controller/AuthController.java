package org.example.proyecto3_tecnica.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.proyecto3_tecnica.models.dto.auth.JwtResponseDTO;
import org.example.proyecto3_tecnica.models.dto.auth.LoginRequestDTO;
import org.example.proyecto3_tecnica.models.dto.auth.RegistroRequestDTO;
import org.example.proyecto3_tecnica.models.dto.usuario.UsuarioResponseDTO;
import org.example.proyecto3_tecnica.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        JwtResponseDTO response = authService.iniciarSesion(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/registro")
    public ResponseEntity<UsuarioResponseDTO> registrar(@Valid @RequestBody RegistroRequestDTO request) {
        UsuarioResponseDTO response = authService.registrarUsuario(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
