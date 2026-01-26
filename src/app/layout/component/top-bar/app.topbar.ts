import { Component, computed, effect, inject } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from '../app-configurator/app.configurator';
import { LayoutService } from '../../service/layout.service';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { SessionService } from '@/core/services/session-service';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '@/core/services/auth-service';
import { Usuario } from '@/core/models/usuario';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, NgOptimizedImage, MenuModule, AvatarModule, BadgeModule, RippleModule],
  templateUrl: './app.topbar.html',
  styleUrls: ['./app.topbar.scss']
})
export class AppTopbar {

  LayoutService = inject(LayoutService);

  isDarkTheme = computed(() => this.LayoutService.layoutConfig().darkTheme);

  items: MenuItem[] = [
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this._logout()
    }
  ];
  public readonly layoutService = inject(LayoutService);
  protected perfil: Usuario | null = null;
  private readonly _sessionService = inject(SessionService);
  private readonly _authService = inject(AuthService);
  private readonly _confirmationService = inject(ConfirmationService);

  constructor() {
    effect(() => {
      const perfil = this._sessionService.perfil();
      if (perfil) {
        this.perfil = perfil;
      }
    });
  }

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }

  private _logout(): void {
    this._confirmationService.confirm({
      header: 'Atenção',
      message: 'Deseja realmente prosseguir e sair do sistema?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._authService.logout();
      },
      acceptLabel: 'Sim, desejo sair',
      acceptButtonStyleClass: 'p-button-danger',
      rejectLabel: 'Não',
      rejectButtonStyleClass: 'p-button-info'
    });
  }
}
