import { MenuItem } from 'primeng/api';

const MENU: MenuItem[] = [
  {
    label: '',
    items: [
      { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
      { label: 'Controle', icon: 'pi pi-fw pi-sort-alt', routerLink: ['/controle'] }
    ]
  },
  {
    label: 'Cadastros',
    items: [
      {
        label: 'Empresas',
        icon: 'pi pi-fw pi-building',
        routerLinkActiveOptions: { exact: false },
        routerLink: ['/empresas']
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-fw pi-users',
        routerLinkActiveOptions: { exact: false },
        routerLink: ['/usuarios']
      },
      {
        label: 'Clientes',
        icon: 'pi pi-fw pi-briefcase',
        routerLinkActiveOptions: { exact: false },
        routerLink: ['/clientes']
      },
      {
        label: 'Materiais',
        icon: 'pi pi-fw pi-car',
        routerLinkActiveOptions: { exact: false },
        routerLink: ['/materiais']
      }
    ]
  },
  {
    label: 'Relatórios',
    items: [
      {
        label: 'Clientes',
        icon: 'pi pi-fw pi-github',
        routerLinkActiveOptions: { exact: false },
        routerLink: ['/relatorio/clientes']
      }
    ]
  },
  {
    label: 'Sistema',
    items: [
      {
        label: 'Logs',
        icon: 'pi pi-fw pi-list',
        routerLinkActiveOptions: { exact: false },
        routerLink: ['/logs']
      }
    ]
  }
];

export { MENU };
