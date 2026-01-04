import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { Home } from '@/pages/home/home';

export default [
    // { path: 'documentation', component: Documentation },
    // { path: 'crud', component: Crud },
    // { path: 'empty', component: Empty },
    { path: 'home', component: Home },
    // { path: '**', redirectTo: '/notfound' }
] as Routes;
