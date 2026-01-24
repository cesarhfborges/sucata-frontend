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
      // {
      //   label: 'Nota',
      //   icon: 'pi pi-fw pi-github',
      //   command: () => {
      //     // const caminho: string = 'SUCATAPORNOTA.rpt';
      //     // const caminhoFormatado = caminho.replace(/\\/g, '/');
      //     const url = 'crystal://SUCATAPORNOTA';
      //     try {
      //       window.location.href = url;
      //     } catch (e) {
      //       console.error('Erro ao disparar o protocolo:', e);
      //       window.open(url, '_self');
      //     }
      //   }
      // },
      // {
      //   label: 'Status',
      //   icon: 'pi pi-fw pi-github',
      //   command: () => {
      //     // const caminho: string = 'SUCATASTATUS.rpt';
      //     // const caminhoFormatado = caminho.replace(/\\/g, '/');
      //     const url = 'crystal://SUCATASTATUS';
      //     try {
      //       window.location.href = url;
      //     } catch (e) {
      //       console.error('Erro ao disparar o protocolo:', e);
      //       window.open(url, '_self');
      //     }
      //   }
      // }
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
