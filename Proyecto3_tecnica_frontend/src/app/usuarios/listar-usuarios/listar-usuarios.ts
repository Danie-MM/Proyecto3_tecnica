import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import {
  HttpErrorResponse,
} from '@angular/common/http';

import {
  RouterLink,
} from '@angular/router';

import {
  finalize,
} from 'rxjs';

import {
  Usuario,
} from '../usuario';

import {
  UsuarioService,
} from '../usuario.service';

@Component({
  selector: 'app-listar-usuarios',
  standalone: true,
  imports: [
    RouterLink,
  ],
  templateUrl:
    './listar-usuarios.html',
  styleUrl:
    './listar-usuarios.css',
})
export class ListarUsuarios
implements OnInit {

  private readonly usuarioService =
    inject(UsuarioService);

  protected readonly usuarios =
    signal<Usuario[]>([]);

  protected readonly cargando =
    signal(false);

  protected readonly mensajeError =
    signal('');

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  protected cargarUsuarios(): void {

    if (this.cargando()) {
      return;
    }

    this.cargando.set(true);
    this.mensajeError.set('');

    this.usuarioService
      .listarUsuarios()
      .pipe(
        finalize(() => {
          this.cargando.set(false);
        }),
      )
      .subscribe({
        next: usuarios => {
          this.usuarios.set(
            usuarios,
          );
        },

        error: (
          error: HttpErrorResponse,
        ) => {

          console.error(
            'Error al listar usuarios:',
            error,
          );

          if (
            error.status === 401
          ) {
            this.mensajeError.set(
              'La sesión ha expirado.',
            );

            return;
          }

          if (
            error.status === 403
          ) {
            this.mensajeError.set(
              'No tienes autorización para consultar los usuarios.',
            );

            return;
          }

          if (
            error.status === 0
          ) {
            this.mensajeError.set(
              'No fue posible conectar con el servidor.',
            );

            return;
          }

          this.mensajeError.set(
            'No fue posible cargar los usuarios.',
          );
        },
      });
  }
}