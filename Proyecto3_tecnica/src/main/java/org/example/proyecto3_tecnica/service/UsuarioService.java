package org.example.proyecto3_tecnica.service;

import lombok.RequiredArgsConstructor;
import org.example.proyecto3_tecnica.models.dto.usuario.UsuarioResponseDTO;
import org.example.proyecto3_tecnica.models.entities.Usuario;
import org.example.proyecto3_tecnica.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Transactional
    public List<UsuarioResponseDTO> listarUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<UsuarioResponseDTO> dtos = new ArrayList<>();

        for (Usuario u : usuarios) {
            UsuarioResponseDTO dto = new UsuarioResponseDTO();
            dto.setId(u.getId());
            dto.setUsername(u.getUsername());
            dto.setActivo(u.isActivo());
            if (u.getRol() != null) {
                dto.setRolNombre(u.getRol().getNombre());
            }
            dtos.add(dto);
        }
        return dtos;
    }
}
