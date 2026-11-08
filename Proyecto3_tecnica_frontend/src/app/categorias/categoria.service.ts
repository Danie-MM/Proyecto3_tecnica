
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Categoria } from './categoria';
import { RegistrarCategoriaRequest } from './registrar-categoria-request';
import { ActualizarCategoriaRequest } from './actualizar-categoria-request';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/categorias';

  obtenerCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  obtenerCategoriaPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  registrarCategoria(request: RegistrarCategoriaRequest): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, request);
  }

  actualizarCategoria(id: number, request: ActualizarCategoriaRequest): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, request);
  }

  eliminarCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
