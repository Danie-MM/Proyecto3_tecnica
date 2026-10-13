package org.example.proyecto3_tecnica.mapper;

import org.example.proyecto3_tecnica.models.dto.categoria.CategoriaRequestDTO;
import org.example.proyecto3_tecnica.models.dto.categoria.CategoriaResponseDTO;
import org.example.proyecto3_tecnica.models.entities.Categoria;
import org.springframework.stereotype.Component;

@Component
public class CategoriaMapper {

    public Categoria convertirAEntidad(CategoriaRequestDTO request) {
        Categoria categoria = new Categoria();
        categoria.setNombre(
                request.getNombre().trim()
        );

        categoria.setDescripcion(
                limpiarTexto(request.getDescripcion())
        );
        return categoria;
    }

    public CategoriaResponseDTO convertirAResponse(Categoria categoria) {

        CategoriaResponseDTO response = new CategoriaResponseDTO();

        response.setId(categoria.getId());
        response.setNombre(categoria.getNombre());
        response.setDescripcion(
                categoria.getDescripcion()
        );
        return response;
    }

    public void actualizarEntidad(Categoria categoria, CategoriaRequestDTO request) {

        categoria.setNombre(request.getNombre().trim());

        categoria.setDescripcion(limpiarTexto(request.getDescripcion()));
    }

    private String limpiarTexto(String texto) {
        if (texto == null) {
            return null;
        }

        String textoLimpio = texto.trim();

        if (textoLimpio.isEmpty()) {
            return null;
        } else {
            return textoLimpio;
        }
    }
}