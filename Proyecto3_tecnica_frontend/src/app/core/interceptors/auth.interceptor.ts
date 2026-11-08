
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from '../../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const token = authService.obtenerToken();

  const esRutaPublica =
    request.url.includes('/api/auth/login') ||
    request.url.includes('/api/auth/registro');

  if (!token || esRutaPublica) {
    return next(request);
  }

  const requestAutenticada = request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(requestAutenticada);
};
