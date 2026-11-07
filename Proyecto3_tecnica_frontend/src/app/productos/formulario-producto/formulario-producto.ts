import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';
import { finalize, forkJoin } from 'rxjs';

import { Categoria } from '../../categorias/categoria';
import { CategoriaService } from '../../categorias/categoria.service';
import { ProductoService } from '../producto.service';
import { RegistrarProductoRequest } from '../registrar-producto-request';
import { ActualizarProductoRequest } from '../actualizar-producto-request';

@Component({
  selector: 'app-formulario-producto',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './formulario-producto.html',
  styleUrl: './formulario-producto.css',
})
export class FormularioProducto implements OnInit {
  private readonly fb =
    inject(NonNullableFormBuilder);

  private readonly productoService =
    inject(ProductoService);

  private readonly categoriaService =
    inject(CategoriaService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private productoId: number | null = null;

  protected readonly categorias =
    signal<Categoria[]>([]);

  protected readonly cargando =
    signal(false);

  protected readonly guardando =
    signal(false);

  protected readonly mensajeError =
    signal('');

  protected readonly modoEdicion =
    signal(false);

  protected readonly form =
    this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.maxLength(150),
        ],
      ],

      descripcion: [
        '',
        [
          Validators.required,
          Validators.maxLength(500),
        ],
      ],

      precio: [
        0,
        [
          Validators.required,
          Validators.min(0.01),
        ],
      ],

      cantidadStock: [
        0,
        [
          Validators.required,
          Validators.min(0),
        ],
      ],

      categoriaId: [
        0,
        [
          Validators.required,
          Validators.min(1),
        ],
      ],
    });

  ngOnInit(): void {
    const idParametro =
      this.route.snapshot.paramMap.get('id');

    if (idParametro === null) {
      this.modoEdicion.set(false);
      this.cargarCategorias();
      return;
    }

    const id = Number(idParametro);

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      this.mensajeError.set(
        'El identificador del producto no es válido.',
      );

      return;
    }

    this.productoId = id;
    this.modoEdicion.set(true);
    this.cargarDatosEdicion();
  }

  private cargarCategorias(): void {
    this.cargando.set(true);
    this.mensajeError.set('');

    this.categoriaService
      .obtenerCategorias()
      .pipe(
        finalize(() => {
          this.cargando.set(false);
        }),
      )
      .subscribe({
        next: (categorias) => {
          this.categorias.set(categorias);
        },

        error: (
          error: HttpErrorResponse,
        ) => {
          console.error(
            'Error al cargar categorías:',
            error,
          );

          this.mensajeError.set(
            'No fue posible cargar las categorías.',
          );
        },
      });
  }

  private cargarDatosEdicion(): void {
    if (this.productoId === null) {
      return;
    }

    this.cargando.set(true);
    this.mensajeError.set('');

    forkJoin({
      categorias:
        this.categoriaService.obtenerCategorias(),

      producto:
        this.productoService.obtenerProductoPorId(
          this.productoId,
        ),
    })
      .pipe(
        finalize(() => {
          this.cargando.set(false);
        }),
      )
      .subscribe({
        next: ({
          categorias,
          producto,
        }) => {
          this.categorias.set(categorias);

          this.form.patchValue({
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            cantidadStock:
              producto.cantidadStock,
            categoriaId:
              producto.categoriaId,
          });
        },

        error: (
          error: HttpErrorResponse,
        ) => {
          console.error(
            'Error al cargar el formulario:',
            error,
          );

          if (error.status === 404) {
            this.mensajeError.set(
              'El producto solicitado no existe.',
            );

            return;
          }

          this.mensajeError.set(
            'No fue posible cargar los datos del producto.',
          );
        },
      });
  }

  protected guardar(): void {
    if (
      this.form.invalid ||
      this.guardando()
    ) {
      this.form.markAllAsTouched();
      return;
    }

    if (
      this.modoEdicion() &&
      this.productoId === null
    ) {
      this.mensajeError.set(
        'No fue posible identificar el producto.',
      );

      return;
    }

    const datos =
      this.form.getRawValue();

    const request:
      RegistrarProductoRequest &
      ActualizarProductoRequest = {
        nombre: datos.nombre.trim(),
        descripcion:
          datos.descripcion.trim(),
        precio: Number(datos.precio),
        cantidadStock:
          Number(datos.cantidadStock),
        categoriaId:
          Number(datos.categoriaId),
      };

    this.guardando.set(true);
    this.mensajeError.set('');

    const operacion =
      this.modoEdicion()
        ? this.productoService
            .actualizarProducto(
              this.productoId!,
              request,
            )
        : this.productoService
            .registrarProducto(request);

    operacion
      .pipe(
        finalize(() => {
          this.guardando.set(false);
        }),
      )
      .subscribe({
        next: () => {
          void this.router.navigate([
            '/productos',
          ]);
        },

        error: (
          error: HttpErrorResponse,
        ) => {
          console.error(
            'Error al guardar producto:',
            error,
          );

          if (error.status === 403) {
            this.mensajeError.set(
              'No tiene permisos para realizar esta acción.',
            );

            return;
          }

          this.mensajeError.set(
            error.error?.message ??
              (
                this.modoEdicion()
                  ? 'No fue posible actualizar el producto.'
                  : 'No fue posible registrar el producto.'
              ),
          );
        },
      });
  }
}