import { Component, inject } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from '../app-configurator/app.configurator';
import { LayoutService } from '../../service/layout.service';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { SessionService } from '@/core/services/session-service';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, NgOptimizedImage, MenuModule, AvatarModule, BadgeModule, RippleModule],
  templateUrl: './app.topbar.html',
  styleUrls: ['./app.topbar.scss']
})
export class AppTopbar {
  items: MenuItem[] = [
    {
      separator: true
    },
    // {
    //   label: 'Documents',
    //   items: [
    //     {
    //       label: 'New',
    //       icon: 'pi pi-plus',
    //       shortcut: '⌘+N'
    //     },
    //     {
    //       label: 'Search',
    //       icon: 'pi pi-search',
    //       shortcut: '⌘+S'
    //     }
    //   ]
    // },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      shortcut: '⌘+O'
    },
    {
      label: 'Messages',
      icon: 'pi pi-inbox',
      badge: '2'
    },
    // {
    //   label: `Modo ${this.isDarkMode ? 'Escuro' : 'Claro'}`,
    //   icon: `pi ${this.isDarkMode ? 'pi-moon' : 'pi-sun'}`
    // },
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this._logout()
      // shortcut: '⌘+Q'
    }
  ];

  private readonly _router = inject(Router);
  public readonly layoutService = inject(LayoutService);
  private readonly _sessionService = inject(SessionService);
  private readonly _confirmationService = inject(ConfirmationService);

  constructor() {}

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }

  private _logout(): void {
    this._confirmationService.confirm({
      header: 'Atenção',
      message: 'Deseja realmente prosseguir e sair do sistema?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._sessionService.clearSession();
        void this._router.navigate(['/login']);
      },
      acceptLabel: 'Sim, desejo sair',
      acceptButtonStyleClass: 'p-button-danger',
      rejectLabel: 'Não',
      rejectButtonStyleClass: 'p-button-info'
    });
  }
}
