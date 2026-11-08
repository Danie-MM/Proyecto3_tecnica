
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../auth.service';
import { RegistroRequest } from './registro-request';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly cargando = signal(false);
  readonly mensajeError = signal('');

  readonly form = this.fb.group({
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z0-9._-]+$/)
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100)
      ]
    ],
    confirmarPassword: [
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ]
  }, {
    validators: this.validarPasswordsIguales
  });

  registrarUsuario(): void {
    if (this.form.invalid || this.cargando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.mensajeError.set('');

    const valores = this.form.getRawValue();

    const request: RegistroRequest = {
      username: valores.username.trim(),
      password: valores.password
    };

    this.authService.registrarUsuario(request)
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigate(['/login'], {
            queryParams: { registroExitoso: true }
          });
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.mensajeError.set('Ya existe un usuario con ese nombre.');
            return;
          }

          if (error.status === 400) {
            this.mensajeError.set(
              error.error?.message ?? 'Los datos enviados no son válidos.'
            );
            return;
          }

          if (error.status === 0) {
            this.mensajeError.set('No fue posible conectar con el servidor. Verifique que el backend esté encendido.');
            return;
          }

          this.mensajeError.set(
            error.error?.message ?? 'Ocurrió un error al registrar el usuario.'
          );
        }
      });
  }

  private validarPasswordsIguales(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmarPassword = control.get('confirmarPassword')?.value;

    if (!password || !confirmarPassword) {
      return null;
    }

    return password === confirmarPassword
      ? null
      : { passwordsNoCoinciden: true };
  }
}
