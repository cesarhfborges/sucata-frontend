import { Routes } from '@angular/router';
import { Home } from '@/pages/home/home';
import { UsuariosEditar, UsuariosListar } from '@/pages/usuarios';

export default [
    { path: 'home', component: Home },
    {
        path: 'usuarios',
        children: [
            { path: '', component: UsuariosListar },
            { path: ':id', component: UsuariosEditar }
        ]
    }
    // { path: '**', redirectTo: '/notfound' }
] as Routes;
