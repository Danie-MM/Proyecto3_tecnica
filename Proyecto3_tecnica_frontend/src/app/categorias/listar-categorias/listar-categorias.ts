import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';

import { Categoria } from '../categoria';
import { CategoriaService } from '../categoria.service';

@Component({
  selector: 'app-listar-categorias',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './listar-categorias.html',
  styleUrl: './listar-categorias.css',
})
export class ListarCategorias
  implements OnInit {
  private readonly categoriaService =
    inject(CategoriaService);

  protected readonly categorias =
    signal<Categoria[]>([]);

  protected readonly cargando =
    signal(false);

  protected readonly mensajeError =
    signal('');

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.cargando.set(true);
    this.mensajeError.set('');

    this.categoriaService
      .obtenerCategorias()
      .subscribe({
        next: (categorias) => {
          this.categorias.set(categorias);
          this.cargando.set(false);
        },
        error: (
          error: HttpErrorResponse,
        ) => {
          console.error(error);

          this.mensajeError.set(
            'No fue posible cargar las categorías.',
          );

          this.cargando.set(false);
        },
      });
  }

  eliminarCategoria(
    categoria: Categoria,
  ): void {
    const confirmar = window.confirm(
      `¿Desea eliminar la categoría "${categoria.nombre}"?`,
    );

    if (!confirmar) {
      return;
    }

    this.categoriaService
      .eliminarCategoria(categoria.id)
      .subscribe({
        next: () => {
          this.categorias.update(
            (categorias) =>
              categorias.filter(
                (item) =>
                  item.id !== categoria.id,
              ),
          );
        },
        error: (
          error: HttpErrorResponse,
        ) => {
          console.error(error);

          this.mensajeError.set(
            'No fue posible eliminar la categoría.',
          );
        },
      });
  }
}