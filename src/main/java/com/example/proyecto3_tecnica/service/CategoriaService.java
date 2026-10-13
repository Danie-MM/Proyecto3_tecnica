package org.example.proyecto3_tecnica.service;

import lombok.RequiredArgsConstructor;
import org.example.proyecto3_tecnica.models.dto.categoria.CategoriaRequestDTO;
import org.example.proyecto3_tecnica.models.dto.categoria.CategoriaResponseDTO;
import org.example.proyecto3_tecnica.models.entities.Categoria;
import org.example.proyecto3_tecnica.repository.CategoriaRepository;
import org.example.proyecto3_tecnica.repository.ProductoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;

    @Transactional
    public List<CategoriaResponseDTO> listar() {
        List<Categoria> categorias = categoriaRepository.findAll();
        List<CategoriaResponseDTO> dtos = new ArrayList<>();

        // Bucle for tradicional en lugar de Streams funcionales
        for (Categoria c : categorias) {
            CategoriaResponseDTO dto = new CategoriaResponseDTO();
            dto.setId(c.getId());
            dto.setNombre(c.getNombre());
            dto.setDescripcion(c.getDescripcion());
            dtos.add(dto);
        }
        return dtos;
    }

    @Transactional
    public CategoriaResponseDTO obtener(Long id) {
        Optional<Categoria> categoriaOptional = categoriaRepository.findById(id);

        if (categoriaOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada");
        }

        Categoria c = categoriaOptional.get();
        CategoriaResponseDTO dto = new CategoriaResponseDTO();
        dto.setId(c.getId());
        dto.setNombre(c.getNombre());
        dto.setDescripcion(c.getDescripcion());
        return dto;
    }

    @Transactional
    public CategoriaResponseDTO guardar(CategoriaRequestDTO request) {
        String nombre = request.getNombre().trim();

        if (categoriaRepository.existsByNombreIgnoreCase(nombre)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una categoría con ese nombre");
        }

        Categoria categoria = new Categoria();
        categoria.setNombre(nombre);
        categoria.setDescripcion(request.getDescripcion());

        Categoria categoriaGuardada = categoriaRepository.save(categoria);

        CategoriaResponseDTO dto = new CategoriaResponseDTO();
        dto.setId(categoriaGuardada.getId());
        dto.setNombre(categoriaGuardada.getNombre());
        dto.setDescripcion(categoriaGuardada.getDescripcion());
        return dto;
    }

    @Transactional
    public CategoriaResponseDTO actualizar(Long id, CategoriaRequestDTO request) {
        Optional<Categoria> categoriaOptional = categoriaRepository.findById(id);

        if (categoriaOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada");
        }

        Categoria categoria = categoriaOptional.get();
        String nuevoNombre = request.getNombre().trim();

        Optional<Categoria> duplicadaOptional = categoriaRepository.findByNombreIgnoreCase(nuevoNombre);

        // Validación imperativa clásica usando ifs tradicionales en lugar de .filter().ifPresent()
        if (duplicadaOptional.isPresent()) {
            Categoria encontrada = duplicadaOptional.get();
            if (!encontrada.getId().equals(id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe otra categoría con ese nombre");
            }
        }

        categoria.setNombre(nuevoNombre);
        categoria.setDescripcion(request.getDescripcion());

        Categoria categoriaActualizada = categoriaRepository.save(categoria);

        CategoriaResponseDTO dto = new CategoriaResponseDTO();
        dto.setId(categoriaActualizada.getId());
        dto.setNombre(categoriaActualizada.getNombre());
        dto.setDescripcion(categoriaActualizada.getDescripcion());
        return dto;
    }

    @Transactional
    public void eliminar(Long id) {
        Optional<Categoria> categoriaOptional = categoriaRepository.findById(id);

        if (categoriaOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada");
        }

        if (productoRepository.existsByCategoriaId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No se puede eliminar la categoría porque tiene productos asociados");
        }

        categoriaRepository.delete(categoriaOptional.get());
    }
}