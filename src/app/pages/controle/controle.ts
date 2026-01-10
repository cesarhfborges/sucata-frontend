import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmpresaService } from '@/core/services/empresa-service';
import { CardModule } from 'primeng/card';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { ScrollerOptions, SelectItem } from 'primeng/api';
import { JsonPipe } from '@angular/common';
import { ClientesService } from '@/core/services/clientes-service';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { findInvalidControls } from '@/shared/utils/find-invalid-controls';

@Component({
  selector: 'app-controle',
  imports: [CardModule, MultiSelectModule, FormsModule, ReactiveFormsModule, RadioButtonModule, SelectModule, JsonPipe, RouterModule, ButtonModule, DividerModule],
  templateUrl: './controle.html',
  styleUrl: './controle.scss'
})
export class Controle implements OnInit {
  form: FormGroup;

  listaStatus: { label: string; value: string }[] = [
    {
      label: 'Todas',
      value: 'TODAS'
    },
    {
      label: 'Pendentes',
      value: 'PENDENTES'
    },
    {
      label: 'Devolvidas',
      value: 'DEVOLVIDAS'
    }
  ];

  listaEmpresas: any[] = [];
  listaClientes: SelectItem[] = [];

  loadLazyTimeout: any = null;

  options: ScrollerOptions = {
    delay: 300,
    showLoader: true,
    lazy: true,
    onLazyLoad: this.onLazyLoad.bind(this)
  };

  private loadings: { [key: string]: boolean } = {
    empresas: false,
    clientes: false
  };
  private readonly _empresasService = inject(EmpresaService);
  private readonly _clientesService = inject(ClientesService);
  private readonly _fb = inject(FormBuilder);

  constructor() {
    this.form = this._fb.group({
      status: new FormControl<string>('TODAS', [Validators.required]),
      cliente: new FormControl<number | null>(null, [Validators.required]),
      empresas: new FormControl<number[]>([], [Validators.required])
    });
  }

  ngOnInit() {
    this.loadEmpresas();
  }

  loadEmpresas(): void {
    this.loadings['empresas'] = true;
    this._empresasService.listar().subscribe({
      next: (data) => {
        this.listaEmpresas = data;
        this.form.get('empresas')?.patchValue(data.map((v) => v.id!));
        this.loadings['empresas'] = false;
      }
    });
  }

  onLazyLoad(event: any): void {
    console.log('LazyLoadÇ ', event);
    if (this.loadings['clientes']) {
      return;
    }

    this.loadings['clientes'] = true;

    const pageSize = event.rows ?? 30;
    const page = event.first ? Math.floor(event.first / pageSize) + 1 : 1;

    this._clientesService
      .listar({
        page,
        per_page: pageSize,
        sort_by: 'nome_razaosocial',
        sort_dir: 'asc'
      })
      .subscribe({
        next: (response) => {
          const novos = response.data.map((cliente) => ({
            label: `${cliente.nome_razaosocial} ${cliente.sobrenome_nomefantasia}`,
            value: cliente.id
          }));

          // concatena mantendo o scroll
          this.listaClientes = [...this.listaClientes, ...novos];

          this.loadings['clientes'] = false;
        },
        error: () => {
          this.loadings['clientes'] = false;
        }
      });
  }

  protected submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      console.log('VALIDO')
    }
  }

  protected invalids() {
    return findInvalidControls(this.form);
  }
}
