import {
  Component,
  inject,
} from '@angular/core';

import {
  Router,
  RouterLink,
} from '@angular/router';

import {
  AuthService,
} from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  protected readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);

  protected cerrarSesion(): void {

    this.authService
      .cerrarSesion();

    void this.router.navigate([
      '/login',
    ]);
  }
}