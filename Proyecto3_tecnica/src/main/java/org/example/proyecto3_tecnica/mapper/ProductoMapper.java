package org.example.proyecto3_tecnica.mapper;

import org.example.proyecto3_tecnica.models.dto.producto.ProductoRequestDTO;
import org.example.proyecto3_tecnica.models.dto.producto.ProductoResponseDTO;
import org.example.proyecto3_tecnica.models.entities.Categoria;
import org.example.proyecto3_tecnica.models.entities.Producto;
import org.springframework.stereotype.Component;

@Component
public class ProductoMapper {

    public Producto convertirAEntidad(ProductoRequestDTO request, Categoria categoria) {
        Producto producto = new Producto();
        producto.setNombre(request.getNombre().trim());
        producto.setDescripcion(limpiarTexto(request.getDescripcion()));
        producto.setPrecio(request.getPrecio());
        producto.setCantidadStock(request.getCantidadStock());
        producto.setCategoria(categoria);
        return producto;
    }

    public ProductoResponseDTO convertirAResponse(Producto producto) {
        ProductoResponseDTO response = new ProductoResponseDTO();
        response.setId(producto.getId());
        response.setNombre(producto.getNombre());
        response.setDescripcion(producto.getDescripcion());
        response.setPrecio(producto.getPrecio());
        response.setCantidadStock(producto.getCantidadStock());

        if (producto.getCategoria() != null) {
            response.setCategoriaId(producto.getCategoria().getId());
            response.setCategoriaNombre(producto.getCategoria().getNombre());
        }

        return response;
    }

    public void actualizarEntidad(Producto producto, ProductoRequestDTO request, Categoria categoria) {
        producto.setNombre(request.getNombre().trim());
        producto.setDescripcion(limpiarTexto(request.getDescripcion()));
        producto.setPrecio(request.getPrecio());
        producto.setCantidadStock(request.getCantidadStock());
        producto.setCategoria(categoria);
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
