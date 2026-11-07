import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Producto } from './producto';
import { RegistrarProductoRequest } from './registrar-producto-request';
import { ActualizarProductoRequest } from './actualizar-producto-request';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8080/productos';

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(
      this.apiUrl,
    );
  }

  obtenerProductoPorId(
    id: number,
  ): Observable<Producto> {
    return this.http.get<Producto>(
      `${this.apiUrl}/${id}`,
    );
  }

  registrarProducto(
    request: RegistrarProductoRequest,
  ): Observable<Producto> {
    return this.http.post<Producto>(
      this.apiUrl,
      request,
    );
  }

  actualizarProducto(
    id: number,
    request: ActualizarProductoRequest,
  ): Observable<Producto> {
    return this.http.put<Producto>(
      `${this.apiUrl}/${id}`,
      request,
    );
  }

  eliminarProducto(
    id: number,
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
    );
  }
}