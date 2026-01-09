import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { DatePipe } from '@angular/common';
import { Button, ButtonDirective } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';
import { Router, RouterLink } from '@angular/router';
import { Usuario } from '@/core/models/usuario';
import { UsuariosService } from '@/core/services/usuarios-service';
import { TableConfig } from '@/core/types/table-config';
import { SessionService } from '@/core/services/session-service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-usuarios-listar',
  imports: [TableModule, CardModule, Tag, DatePipe, Button, ButtonGroup, RouterLink, ButtonDirective],
  templateUrl: './usuarios-listar.html',
  styleUrl: './usuarios-listar.scss'
})
export class UsuariosListar implements OnInit {
  protected tableConfig: TableConfig = {
    pagination: {
      rows: 10,
      options: [10, 25, 50]
    },
    sort: {
      field: 'nome',
      order: 1
    }
  };

  protected usuarios: Usuario[] = [];
  protected loading: boolean = false;

  private readonly _router = inject(Router);
  private readonly _session = inject(SessionService);
  private readonly _usuariosService = inject(UsuariosService);
  private readonly _messageService = inject(MessageService);
  private readonly _confirmationService = inject(ConfirmationService);

  ngOnInit(): void {
    this.loading = true;
    this._usuariosService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      }
    });
  }

  protected editar(id: number) {
    if (this._session.perfil()?.id === id) {
      void this._router.navigate(['/perfil']);
    } else {
      void this._router.navigate(['/usuarios', id]);
    }
  }

  protected delete(event: Event, id: number) {
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      blockScroll: true,
      closeOnEscape: true,
      header: 'Atenção',
      message: 'Deseja realmente excluir este item?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'info',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Sim, excluir',
        severity: 'danger'
      },
      accept: () => this.excluirUsuario(id)
    });
  }

  private excluirUsuario(id: number): void {
    this._usuariosService.delete(id).subscribe({
      next: (result) => {
        this.usuarios = this.usuarios.filter((v) => v.id !== id);
        this._messageService.add({ severity: 'info', summary: 'Sucesso', detail: result.message || 'Usuario excluído com sucesso.' });
      }
    });
  }
}
