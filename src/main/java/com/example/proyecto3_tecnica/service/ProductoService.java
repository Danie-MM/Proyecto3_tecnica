package org.example.proyecto3_tecnica.service;

import lombok.RequiredArgsConstructor;
import org.example.proyecto3_tecnica.models.dto.producto.ProductoRequestDTO;
import org.example.proyecto3_tecnica.models.dto.producto.ProductoResponseDTO;
import org.example.proyecto3_tecnica.models.entities.Categoria;
import org.example.proyecto3_tecnica.models.entities.Producto;
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
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    @Transactional
    public List<ProductoResponseDTO> listar() {
        List<Producto> productos = productoRepository.findAll();
        List<ProductoResponseDTO> dtos = new ArrayList<>();

        for (Producto p : productos) {
            ProductoResponseDTO dto = new ProductoResponseDTO();
            dto.setId(p.getId());
            dto.setNombre(p.getNombre());
            dto.setDescripcion(p.getDescripcion());
            dto.setPrecio(p.getPrecio());
            dto.setCantidadStock(p.getCantidadStock());
            if (p.getCategoria() != null) {
                dto.setCategoriaId(p.getCategoria().getId());
                dto.setCategoriaNombre(p.getCategoria().getNombre());
            }
            dtos.add(dto);
        }
        return dtos;
    }

    @Transactional
    public ProductoResponseDTO obtener(Long id) {
        Optional<Producto> productoOptional = productoRepository.findById(id);

        if (productoOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado");
        }

        Producto p = productoOptional.get();
        ProductoResponseDTO dto = new ProductoResponseDTO();
        dto.setId(p.getId());
        dto.setNombre(p.getNombre());
        dto.setDescripcion(p.getDescripcion());
        dto.setPrecio(p.getPrecio());
        dto.setCantidadStock(p.getCantidadStock());
        if (p.getCategoria() != null) {
            dto.setCategoriaId(p.getCategoria().getId());
            dto.setCategoriaNombre(p.getCategoria().getNombre());
        }
        return dto;
    }

    @Transactional
    public ProductoResponseDTO guardar(ProductoRequestDTO request) {
        Optional<Categoria> categoriaOptional = categoriaRepository.findById(request.getCategoriaId());

        if (categoriaOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La categoría indicada no existe");
        }
        Producto producto = new Producto();
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setCantidadStock(request.getCantidadStock());
        producto.setCategoria(categoriaOptional.get());

        Producto productoGuardado = productoRepository.save(producto);

        ProductoResponseDTO dto = new ProductoResponseDTO();
        dto.setId(productoGuardado.getId());
        dto.setNombre(productoGuardado.getNombre());
        dto.setDescripcion(productoGuardado.getDescripcion());
        dto.setPrecio(productoGuardado.getPrecio());
        dto.setCantidadStock(productoGuardado.getCantidadStock());
        dto.setCategoriaId(productoGuardado.getCategoria().getId());
        dto.setCategoriaNombre(productoGuardado.getCategoria().getNombre());
        return dto;
    }

    @Transactional
    public ProductoResponseDTO actualizar(Long id, ProductoRequestDTO request) {
        Optional<Producto> productoOptional = productoRepository.findById(id);
        if (productoOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado");
        }

        Optional<Categoria> categoriaOptional = categoriaRepository.findById(request.getCategoriaId());
        if (categoriaOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La categoría indicada no existe");
        }

        Producto producto = productoOptional.get();
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setCantidadStock(request.getCantidadStock());
        producto.setCategoria(categoriaOptional.get());

        Producto productoActualizado = productoRepository.save(producto);

        ProductoResponseDTO dto = new ProductoResponseDTO();
        dto.setId(productoActualizado.getId());
        dto.setNombre(productoActualizado.getNombre());
        dto.setDescripcion(productoActualizado.getDescripcion());
        dto.setPrecio(productoActualizado.getPrecio());
        dto.setCantidadStock(productoActualizado.getCantidadStock());
        dto.setCategoriaId(productoActualizado.getCategoria().getId());
        dto.setCategoriaNombre(productoActualizado.getCategoria().getNombre());
        return dto;
    }

    @Transactional
    public void eliminar(Long id) {
        Optional<Producto> productoOptional = productoRepository.findById(id);
        if (productoOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado");
        }

        productoRepository.delete(productoOptional.get());
    }
}
