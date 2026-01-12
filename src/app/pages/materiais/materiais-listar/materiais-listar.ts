import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { CardModule } from 'primeng/card';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RouterModule } from '@angular/router';
import { Material } from '@/core/models/material';
import { TableConfig } from '@/core/types/table-config';
import { MateriaisService } from '@/core/services/materiais-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';

interface TbConfig extends TableConfig {
  totalRecords: number;
}

@Component({
  selector: 'app-materiais-listar',
  imports: [RouterModule, ButtonModule, ButtonGroupModule, CardModule, TableModule, TagModule, IconField, InputIcon, InputText],
  templateUrl: './materiais-listar.html',
  styleUrl: './materiais-listar.scss'
})
export class MateriaisListar implements OnInit {
  lista: Material[] = [];
  loading: boolean = false;
  protected tableConfig: TbConfig = {
    totalRecords: 0,
    pagination: {
      rows: 10,
      options: [10, 25, 50]
    },
    sort: {
      field: 'codigo',
      order: 1
    }
  };

  private readonly _materiaisService = inject(MateriaisService);
  private readonly _messageService = inject(MessageService);
  private readonly _confirmationService = inject(ConfirmationService);

  ngOnInit(): void {}

  loadMateriais(event: TableLazyLoadEvent): void {
    this.loading = true;

    const rows = event.rows ?? this.tableConfig.pagination.rows;

    const first = event.first ?? 0;

    const page = Math.floor(first / rows) + 1;

    this._materiaisService
      .listar({
        page,
        per_page: rows,
        sort_by: (event.sortField as any) ?? this.tableConfig.sort.field,
        sort_dir: event.sortOrder === 1 ? 'asc' : 'desc',
        filter: event.globalFilter as string
      })
      .subscribe({
        next: (response) => {
          this.lista = response.data;
          this.tableConfig.totalRecords = response.total;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  protected confirmDelete(event: Event, codigo: string) {
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
      accept: () => this.excluir(codigo)
    });
  }

  private excluir(codigo: string): void {
    this._materiaisService.delete(codigo).subscribe({
      next: (result) => {
        this.lista = this.lista.filter((v) => v.codigo !== codigo);
        this._messageService.add({ severity: 'info', summary: 'Sucesso', detail: result.message || 'Material excluído com sucesso.' });
      }
    });
  }
}
