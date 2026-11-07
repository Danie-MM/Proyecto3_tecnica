
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { ActualizarCategoriaRequest } from '../actualizar-categoria-request';
import { CategoriaService } from '../categoria.service';
import { RegistrarCategoriaRequest } from '../registrar-categoria-request';

@Component({
  selector: 'app-formulario-categoria',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './formulario-categoria.html',
  styleUrl: './formulario-categoria.css'
})
export class FormularioCategoria implements OnInit {

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly categoriaService = inject(CategoriaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private categoriaId: number | null = null;

  protected readonly modoEdicion = signal(false);
  protected readonly cargando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly mensajeError = signal('');

  protected readonly form = this.fb.group({
    nombre: [
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ],
    descripcion: [
      '',
      [
        Validators.required,
        Validators.maxLength(500)
      ]
    ]
  });

  ngOnInit(): void {
    const idParametro = this.route.snapshot.paramMap.get('id');

    if (idParametro === null) {
      return;
    }

    const id = Number(idParametro);

    if (!Number.isInteger(id) || id <= 0) {
      this.mensajeError.set('El identificador de la categoría no es válido.');
      return;
    }

    this.categoriaId = id;
    this.modoEdicion.set(true);
    this.cargarCategoria();
  }

  private cargarCategoria(): void {
    if (this.categoriaId === null) {
      return;
    }

    this.cargando.set(true);
    this.mensajeError.set('');

    this.categoriaService.obtenerCategoriaPorId(this.categoriaId)
      .pipe(
        finalize(() => this.cargando.set(false))
      )
      .subscribe({
        next: categoria => {
          this.form.patchValue({
            nombre: categoria.nombre,
            descripcion: categoria.descripcion
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al cargar categoría:', error);

          if (error.status === 404) {
            this.mensajeError.set('La categoría solicitada no existe.');
            return;
          }

          this.mensajeError.set(
            error.error?.message ?? 'No fue posible cargar la categoría.'
          );
        }
      });
  }

  protected guardar(): void {
    if (this.form.invalid || this.guardando()) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.modoEdicion() && this.categoriaId === null) {
      this.mensajeError.set('No fue posible identificar la categoría.');
      return;
    }

    const datos = this.form.getRawValue();

    const request: RegistrarCategoriaRequest & ActualizarCategoriaRequest = {
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim()
    };

    this.guardando.set(true);
    this.mensajeError.set('');

    const operacion = this.modoEdicion()
      ? this.categoriaService.actualizarCategoria(this.categoriaId!, request)
      : this.categoriaService.registrarCategoria(request);

    operacion
      .pipe(
        finalize(() => this.guardando.set(false))
      )
      .subscribe({
        next: () => {
          void this.router.navigate(['/categorias']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al guardar categoría:', error);

          if (error.status === 403) {
            this.mensajeError.set('No tiene permisos para realizar esta acción.');
            return;
          }

          if (error.status === 409) {
            this.mensajeError.set(
              error.error?.message ?? 'Ya existe una categoría con ese nombre.'
            );
            return;
          }

          const mensaje = this.modoEdicion()
            ? 'No fue posible actualizar la categoría.'
            : 'No fue posible registrar la categoría.';

          this.mensajeError.set(error.error?.message ?? mensaje);
        }
      });
  }
}
