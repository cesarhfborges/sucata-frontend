import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RouterModule } from '@angular/router';
import { Empresa } from '@/core/models/empresa';
import { NgxMaskPipe } from 'ngx-mask';
import { EmpresaService } from '@/core/services/empresa-service';
import { TableConfig } from '@/core/types/table-config';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-empresas-listar',
  imports: [ButtonModule, ButtonGroupModule, CardModule, TableModule, TagModule, RouterModule, NgxMaskPipe, ConfirmDialogModule],
  templateUrl: './empresas-listar.html',
  styleUrl: './empresas-listar.scss'
})
export class EmpresasListar implements OnInit {
  loading = false;
  empresas: Empresa[] = [];

  protected tableConfig: TableConfig = {
    pagination: {
      rows: 10,
      options: [10, 25, 50]
    },
    sort: {
      field: 'id',
      order: 1
    }
  };

  private readonly _empresaService = inject(EmpresaService);
  private readonly _messageService = inject(MessageService);
  private readonly _confirmationService = inject(ConfirmationService);

  ngOnInit(): void {
    this.loading = true;
    this._empresaService.listar().subscribe({
      next: (result) => {
        console.log(result);
        this.empresas = result;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error(error);
      }
    });
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
      accept: () => this.excluirEmpresa(id)
    });
  }

  private excluirEmpresa(id: number): void {
    this._empresaService.delete(id).subscribe({
      next: (result) => {
        this.empresas = this.empresas.filter((v) => v.id !== id);
        this._messageService.add({ severity: 'info', summary: 'Sucesso', detail: result.message || 'Empresa excluída com sucesso.' });
      }
    });
  }
}
