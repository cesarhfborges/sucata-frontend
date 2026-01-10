import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { ScrollerOptions } from 'primeng/api';
import { JsonPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';

import { EmpresaService } from '@/core/services/empresa-service';
import { ClientesService } from '@/core/services/clientes-service';
import { Empresa } from '@/core/models/empresa';
import { Cliente } from '@/core/models/cliente';

import { NotasFiscais } from '@/pages/controle/components/notas-fiscais/notas-fiscais';
import { ItensNota } from '@/pages/controle/components/itens-nota/itens-nota';

import { NgxMaskPipe } from 'ngx-mask';
import { findInvalidControls } from '@/shared/utils/find-invalid-controls';
import { ValidatorMessage } from '@/shared/components/validator-message/validator-message';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-controle',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    MultiSelectModule,
    RadioButtonModule,
    SelectModule,
    JsonPipe,
    RouterModule,
    ButtonModule,
    DividerModule,
    NotasFiscais,
    ItensNota,
    NgxMaskPipe,
    ValidatorMessage,
    IconFieldModule,
    InputIconModule,
    InputTextModule
  ],
  templateUrl: './controle.html',
  styleUrl: './controle.scss'
})
export class Controle implements OnInit {
  form: FormGroup;

  listaClientes: Cliente[] = [];
  listaEmpresas: Empresa[] = [];

  listaStatus = [
    { label: 'Todas', value: 'TODAS' },
    { label: 'Pendentes', value: 'PENDENTE' },
    { label: 'Devolvidas', value: 'DEVOLVIDA' }
  ];

  options: ScrollerOptions = {
    lazy: true,
    showLoader: true,
    delay: 0,
    onLazyLoad: this.onLazyLoadClientes.bind(this)
  };

  protected clientesFiltro = '';
  protected clientesLoading = false;

  private clientesPage = 1;
  private readonly clientesPerPage = 100;
  private lastLazyFirst = 0;
  private filtroTimeout: any = null;
  private clientesHasMore = true;

  private readonly _fb = inject(FormBuilder);
  private readonly _empresasService = inject(EmpresaService);
  private readonly _clientesService = inject(ClientesService);

  constructor() {
    this.form = this._fb.group({
      status: new FormControl<string>('TODAS', [Validators.required]),
      cliente: new FormControl<number | null>(null, [Validators.required]),
      empresas: new FormControl<number[]>([], [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadEmpresas();
  }

  onOpenClientes(): void {
    if (this.listaClientes.length > 0) {
      return;
    }

    this.resetClientes();
    this.loadClientes();
  }

  onLazyLoadClientes(event: any): void {
    if (this.clientesLoading || !this.clientesHasMore) {
      return;
    }

    const first = event.first ?? 0;

    if (first === this.lastLazyFirst) {
      return;
    }

    this.lastLazyFirst = first;

    const shouldLoadNextPage = first + this.clientesPerPage >= this.listaClientes.length;

    if (!shouldLoadNextPage) {
      return;
    }

    this.loadClientes();
  }

  onFiltroInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();

    if (value === this.clientesFiltro) {
      return;
    }

    clearTimeout(this.filtroTimeout);

    this.filtroTimeout = setTimeout(() => {
      this.clientesFiltro = value;
      this.resetClientes();
      this.loadClientes();
    }, 400);
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      console.log('FORM VALID', this.form.value);
    } else {
      console.log('FORM INVALID');
    }
  }

  protected invalids() {
    return findInvalidControls(this.form);
  }

  private loadEmpresas(): void {
    this._empresasService.listar().subscribe({
      next: (data) => {
        this.listaEmpresas = data;
        this.form.get('empresas')?.patchValue(data.map((e) => e.id!));
      }
    });
  }

  private loadClientes(): void {
    if (this.clientesLoading || !this.clientesHasMore) {
      return;
    }

    this.clientesLoading = true;

    this._clientesService
      .listar({
        page: this.clientesPage,
        per_page: this.clientesPerPage,
        filter: this.clientesFiltro || undefined,
        sort_by: 'nome_razaosocial',
        sort_dir: 'asc'
      })
      .subscribe({
        next: (response) => {
          const novos: Cliente[] = response.data ?? [];

          this.listaClientes = [...this.listaClientes, ...novos];

          if (this.clientesPage >= response.last_page) {
            this.clientesHasMore = false;
          } else {
            this.clientesPage++;
          }

          this.clientesLoading = false;
        },
        error: () => {
          this.clientesLoading = false;
        }
      });
  }

  private resetClientes(): void {
    this.listaClientes = [];
    this.clientesPage = 1;
    this.clientesHasMore = true;
    this.lastLazyFirst = 0;
  }
}
