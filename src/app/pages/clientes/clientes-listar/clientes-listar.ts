import { Component, inject, OnInit } from '@angular/core';
import { Cliente } from '@/core/models/cliente';
import { ClientesService } from '@/core/services/clientes-service';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';
import { CardModule } from 'primeng/card';
import { NgxMaskPipe } from 'ngx-mask';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TableConfig } from '@/core/types/table-config';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';

interface TbConfig extends TableConfig {
  totalRecords: number;
}

@Component({
  selector: 'app-clientes-listar',
  imports: [RouterModule, ButtonModule, ButtonGroup, CardModule, NgxMaskPipe, TableModule, IconFieldModule, InputIconModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './clientes-listar.html',
  styleUrl: './clientes-listar.scss'
})
export class ClientesListar implements OnInit {
  loading = false;
  protected clientes: Cliente[] = [];

  protected tableConfig: TbConfig = {
    totalRecords: 0,
    pagination: {
      rows: 25,
      options: [10, 25, 50]
    },
    sort: {
      field: 'nome_razaosocial',
      order: 1
    }
  };

  private readonly _clientesService = inject(ClientesService);
  private readonly _messageService = inject(MessageService);
  private readonly _confirmationService = inject(ConfirmationService);

  ngOnInit() {}

  loadClientes(event: TableLazyLoadEvent): void {
    this.loading = true;

    const rows = event.rows ?? this.tableConfig.pagination.rows;

    const first = event.first ?? 0;

    const page = Math.floor(first / rows) + 1;

    this._clientesService
      .listar({
        page,
        per_page: rows,
        sort_by: (event.sortField as any) ?? this.tableConfig.sort.field,
        sort_dir: event.sortOrder === 1 ? 'asc' : 'desc',
        filter: event.globalFilter as string
      })
      .subscribe({
        next: (response) => {
          this.clientes = response.data;
          this.tableConfig.totalRecords = response.total;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  protected confirmDelete(event: Event, id: number) {
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
      accept: () => this.excluir(id)
    });
  }

  private excluir(id: number): void {
    this._clientesService.delete(id).subscribe({
      next: (result) => {
        this.clientes = this.clientes.filter((v) => v.id !== id);
        this._messageService.add({ severity: 'info', summary: 'Sucesso', detail: result.message || 'Empresa excluída com sucesso.' });
      }
    });
  }
}
