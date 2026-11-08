
import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Producto } from '../producto';
import { ProductoService } from '../producto.service';

@Component({
  selector: 'app-listar-productos',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './listar-productos.html',
  styleUrl: './listar-productos.css'
})
export class ListarProductos implements OnInit {

  private readonly productoService = inject(ProductoService);

  protected readonly productos = signal<Producto[]>([]);
  protected readonly cargando = signal(false);
  protected readonly mensajeError = signal('');

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando.set(true);
    this.mensajeError.set('');

    this.productoService.obtenerProductos().subscribe({
      next: productos => {
        this.productos.set(productos);
        this.cargando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar productos:', error);
        this.mensajeError.set('No fue posible cargar los productos.');
        this.cargando.set(false);
      }
    });
  }

  eliminarProducto(producto: Producto): void {
    const confirmar = window.confirm(
      `¿Desea eliminar el producto "${producto.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    this.productoService.eliminarProducto(producto.id).subscribe({
      next: () => {
        this.productos.update(productos =>
          productos.filter(item => item.id !== producto.id)
        );
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al eliminar producto:', error);
        this.mensajeError.set('No fue posible eliminar el producto.');
      }
    });
  }
}
