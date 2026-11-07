
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { RegistroRequest } from './registro/registro-request';
import { UsuarioResponse } from './registro/usuario-response';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface JwtResponse {
  token: string;
  username: string;
  role: string;
}

export interface UsuarioActual {
  username: string;
  role: string;
}

interface JwtPayload {
  sub?: string;
  username?: string;
  rol?: string;
  role?: string;
  roles?: string[];
  authorities?: string[];
  iat?: number;
  exp?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/auth';
  private readonly tokenKey = 'token';
  private readonly usuarioKey = 'usuarioActual';

  readonly usuarioActual = signal<UsuarioActual | null>(
    this.cargarUsuarioActual()
  );

  iniciarSesion(request: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.baseUrl}/login`, request).pipe(
      tap(response => {
        const payload = this.obtenerPayload(response.token);

        const usuario: UsuarioActual = {
          username: response.username || payload?.username || payload?.sub || '',
          role: response.role || payload?.rol || payload?.role ||
                payload?.roles?.[0] || payload?.authorities?.[0] || ''
        };

        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
        }

        this.usuarioActual.set(usuario);
      })
    );
  }

  registrarUsuario(request: RegistroRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${this.baseUrl}/registro`, request);
  }

  obtenerToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    return localStorage.getItem(this.tokenKey);
  }

  estaAutenticado(): boolean {
    const token = this.obtenerToken();

    if (!token) {
      return false;
    }

    const payload = this.obtenerPayload(token);

    if (!payload) {
      return false;
    }

    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      this.cerrarSesion();
      return false;
    }

    return true;
  }

  obtenerRoles(): string[] {
    const role = this.usuarioActual()?.role;
    return role ? [role] : [];
  }

  hasRole(roleEsperado: string): boolean {
    const roleActual = this.usuarioActual()?.role;

    if (!roleActual) {
      return false;
    }

    return this.normalizarRole(roleActual) === this.normalizarRole(roleEsperado);
  }

  hasAnyRole(rolesPermitidos: string[]): boolean {
    return rolesPermitidos.some(role => this.hasRole(role));
  }

  cerrarSesion(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.usuarioKey);
    }

    this.usuarioActual.set(null);
  }

  private cargarUsuarioActual(): UsuarioActual | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const token = this.obtenerToken();

    if (!token) {
      return null;
    }

    const payload = this.obtenerPayload(token);

    if (!payload || (payload.exp && payload.exp * 1000 <= Date.now())) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.usuarioKey);
      return null;
    }

    const usuarioDesdeToken = this.convertirPayloadAUsuario(payload);

    if (usuarioDesdeToken.username && usuarioDesdeToken.role) {
      localStorage.setItem(this.usuarioKey, JSON.stringify(usuarioDesdeToken));
      return usuarioDesdeToken;
    }

    const usuarioGuardado = localStorage.getItem(this.usuarioKey);

    if (!usuarioGuardado) {
      return null;
    }

    try {
      const usuario = JSON.parse(usuarioGuardado) as UsuarioActual;

      if (!usuario.username || !usuario.role) {
        return null;
      }

      return usuario;
    } catch (error) {
      console.error('No fue posible leer el usuario almacenado:', error);
      localStorage.removeItem(this.usuarioKey);
      return null;
    }
  }

  private convertirPayloadAUsuario(payload: JwtPayload): UsuarioActual {
    const username = payload.username ?? payload.sub ?? '';
    const role = payload.rol ?? payload.role ??
                 payload.roles?.[0] ?? payload.authorities?.[0] ?? '';

    return { username, role };
  }

  private normalizarRole(role: string): string {
    return role
      .trim()
      .toUpperCase()
      .replace(/^ROLE_/, '')
      .replace(/_/g, '-');
  }

  private obtenerPayload(token: string): JwtPayload | null {
    try {
      const partes = token.split('.');

      if (partes.length !== 3) {
        return null;
      }

      const base64 = partes[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const base64ConRelleno = base64.padEnd(
        Math.ceil(base64.length / 4) * 4,
        '='
      );

      const payloadJson = decodeURIComponent(
        atob(base64ConRelleno)
          .split('')
          .map(caracter => {
            const codigo = caracter.charCodeAt(0).toString(16);
            return `%${('00' + codigo).slice(-2)}`;
          })
          .join('')
      );

      return JSON.parse(payloadJson) as JwtPayload;
    } catch (error) {
      console.error('No fue posible leer el JWT:', error);
      return null;
    }
  }
}
