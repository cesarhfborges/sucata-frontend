import { Routes } from '@angular/router';
import { Home } from '@/pages/home/home';
import { Perfil } from '@/pages/perfil/perfil';
import { UsuariosEditar, UsuariosListar } from '@/pages/usuarios';
import { EmpresasEditar, EmpresasListar } from '@/pages/empresas';
import { ClientesEditar, ClientesListar } from '@/pages/clientes';

export default [
  { path: 'home', component: Home },
  { path: 'perfil', component: Perfil },
  {
    path: 'usuarios',
    children: [
      { path: '', component: UsuariosListar },
      { path: ':id', component: UsuariosEditar }
    ]
  },
  {
    path: 'empresas',
    children: [
      { path: '', component: EmpresasListar },
      { path: ':id', component: EmpresasEditar }
    ]
  },
  {
    path: 'clientes',
    children: [
      { path: '', component: ClientesListar },
      { path: ':id', component: ClientesEditar }
    ]
  }
] as Routes;
