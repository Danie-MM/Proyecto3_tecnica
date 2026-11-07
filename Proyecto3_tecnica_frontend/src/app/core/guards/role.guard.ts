
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.estaAutenticado()) {
    return router.createUrlTree(['/login']);
  }

  const rolesPermitidos = route.data['roles'] as string[] | undefined;

  if (!rolesPermitidos || authService.hasAnyRole(rolesPermitidos)) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
