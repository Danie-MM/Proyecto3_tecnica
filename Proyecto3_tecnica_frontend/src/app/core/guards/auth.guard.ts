import {
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  CanActivateFn,
  Router,
} from '@angular/router';

import { AuthService } from '../../auth/auth.service';

export const authGuard: CanActivateFn = (
  _route,
  state,
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  /*
   * Durante SSR no existe localStorage.
   * La validación real se realiza cuando
   * Angular se ejecuta en el navegador.
   */
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (authService.estaAutenticado()) {
    return true;
  }

  return router.createUrlTree(
    ['/login'],
    {
      queryParams: {
        returnUrl: state.url,
      },
    },
  );
};