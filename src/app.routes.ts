import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/component/app.layout';
import { guestGuard } from '@/core/guards/guest-guard';
import { authGuard } from '@/core/guards/auth-guard';
import { Login } from '@/auth/login/login';
import { NotFound } from '@/auth/not-found/not-found';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AppLayout,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    loadChildren: () => import('./app/pages/pages.routes')
  },
  {
    path: '',
    canActivate: [guestGuard],
    canActivateChild: [guestGuard],
    loadChildren: () => import('./app/auth/auth.routes')
  },
  // { path: 'landing', component: Landing },
  // { path: 'notfound', component: Notfound },
  // { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
  { path: 'not-found', component: NotFound },
  { path: '**', redirectTo: '/not-found' }
];
