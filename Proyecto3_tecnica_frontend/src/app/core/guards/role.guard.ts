import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
} from '@angular/router';

import { AuthService } from '../../auth/auth.service';

export const roleGuard = (
  allowedRoles: string[],
): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.estaAutenticado()) {
      return router.createUrlTree(['/login']);
    }

    if (
      authService.hasAnyRole(allowedRoles)
    ) {
      return true;
    }

    return router.createUrlTree(['/dashboard']);
  };
};