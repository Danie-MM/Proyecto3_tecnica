import {
  inject,
  Injectable,
} from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';

import {
  Observable,
} from 'rxjs';

import {
  Usuario,
} from './usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private readonly http =
    inject(HttpClient);

  private readonly baseUrl =
    'http://localhost:8080/api/usuarios';

  listarUsuarios():
    Observable<Usuario[]> {

    return this.http.get<Usuario[]>(
      this.baseUrl,
    );
  }
}