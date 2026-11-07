import { Routes } from '@angular/router';
import { Registro } from './auth/registro/registro';
import { Login } from './auth/login/login';
import { Dashboard } from './dashboard/dashboard';
import { ListarCategorias } from './categorias/listar-categorias/listar-categorias';
import { FormularioCategoria } from './categorias/formulario-categoria/formulario-categoria';
import { ListarProductos } from './productos/listar-productos/listar-productos';
import { FormularioProducto } from './productos/formulario-producto/formulario-producto';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

const superAdmin = { roles: ['SUPER-ADMIN-ROLE'] };

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'registro', component: Registro },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },

  { 
    path: 'usuarios', 
    loadComponent: () => import('./usuarios/listar-usuarios/listar-usuarios').then(m => m.ListarUsuarios), 
    canActivate: [authGuard, roleGuard], 
    data: superAdmin 
  },

  { path: 'categorias', component: ListarCategorias, canActivate: [authGuard] },
  { path: 'categorias/registrar', component: FormularioCategoria, canActivate: [authGuard, roleGuard], data: superAdmin },
  { path: 'categorias/editar/:id', component: FormularioCategoria, canActivate: [authGuard, roleGuard], data: superAdmin },

  { path: 'productos', component: ListarProductos, canActivate: [authGuard] },
  { path: 'productos/registrar', component: FormularioProducto, canActivate: [authGuard, roleGuard], data: superAdmin },
  { path: 'productos/editar/:id', component: FormularioProducto, canActivate: [authGuard, roleGuard], data: superAdmin },

  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
