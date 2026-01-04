import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/component/app.layout';
import { Dashboard } from '@/pages/dashboard/dashboard';
import { Documentation } from '@/pages/documentation/documentation';
import { Landing } from '@/pages/landing/landing';
import { Notfound } from '@/pages/notfound/notfound';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
    },
    {
        path: '',
        component: AppLayout,
        children: [
            // { path: '', component: Dashboard },
            // { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            // { path: 'documentation', component: Documentation },
            { path: '', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    // { path: 'landing', component: Landing },
    // { path: 'notfound', component: Notfound },
    // { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
