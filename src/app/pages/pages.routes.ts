import { Routes } from '@angular/router';
import { Home } from '@/pages/home/home';
import { Perfil } from '@/pages/perfil/perfil';
import { UsuariosEditar, UsuariosListar } from '@/pages/usuarios';
import { EmpresasEditar, EmpresasListar } from '@/pages/empresas';
import { ClientesEditar, ClientesListar } from '@/pages/clientes';
import { Controle } from '@/pages/controle/controle';
import { MateriaisEditar, MateriaisListar } from '@/pages/materiais';
import { RelatorioClientes } from '@/pages/relatorios';
import { Logs } from '@/pages/logs/logs';

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
  },
  {
    path: 'materiais',
    children: [
      { path: '', component: MateriaisListar },
      { path: ':id', component: MateriaisEditar }
    ]
  },
  {
    path: 'controle',
    component: Controle
  },
  {
    path: 'relatorio',
    children: [
      { path: 'clientes', component: RelatorioClientes }
    ]
  },
  { path: 'logs', component: Logs }
] as Routes;
