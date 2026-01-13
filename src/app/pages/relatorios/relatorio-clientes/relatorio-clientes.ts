import { Component, inject, OnInit } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { Card, CardModule } from 'primeng/card';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { JsonPipe } from '@angular/common';
import { MultiSelect, MultiSelectModule } from 'primeng/multiselect';
import { NgxMaskPipe } from 'ngx-mask';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Select, SelectModule } from 'primeng/select';
import { ValidatorMessage } from '@/shared/components/validator-message/validator-message';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChipModule } from 'primeng/chip';
import { PanelModule } from 'primeng/panel';
import { ListboxModule } from 'primeng/listbox';
import { Empresa } from '@/core/models/empresa';
import { Cliente } from '@/core/models/cliente';
import { ScrollerOptions } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { EmpresaService } from '@/core/services/empresa-service';
import { ClientesService } from '@/core/services/clientes-service';
import { format, subDays } from 'date-fns';

@Component({
  selector: 'app-relatorio-clientes',
  imports: [
    ReactiveFormsModule,
    ValidatorMessage,
    CardModule,
    InputNumberModule,
    ChipModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    PanelModule,
    JsonPipe,
    MultiSelectModule,
    PdfJsViewerModule,
    ListboxModule,
    IconField,
    InputIcon,
    InputText,
    NgxMaskPipe
  ],
  templateUrl: './relatorio-clientes.html',
  styleUrl: './relatorio-clientes.scss'
})
export class RelatorioClientes implements OnInit {
  loading = {
    pdf: false,
    empresas: false,
    clientes: false
  };

  form: FormGroup;

  listaEmpresas: Empresa[] = [];
  listaClientes: Cliente[] = [];

  clientesConfig: {
    options: ScrollerOptions;
    clientesFiltro: string;
    lastLazyFirst: number;
    clientesPage: number;
    clientesPerPage: number;
    filtroTimeout: any;
    clientesHasMore: boolean;
  } = {
    clientesFiltro: '',
    lastLazyFirst: 0,
    clientesPage: 1,
    clientesPerPage: 100,
    filtroTimeout: null,
    clientesHasMore: true,
    options: {
      lazy: true,
      showLoader: true,
      delay: 0,
      onLazyLoad: this.onLazyLoadClientes.bind(this)
    }
  };

  protected pdfUrl: Uint8Array | null = null;

  private readonly _fb = inject(FormBuilder);
  private readonly _http = inject(HttpClient);
  private readonly _sanitizer = inject(DomSanitizer);
  private readonly _empresasService = inject(EmpresaService);
  private readonly _clientesService = inject(ClientesService);

  constructor() {
    this.form = this._fb.group({
      empresas: new FormControl<Empresa[]>([], [Validators.required]),
      cliente_id: new FormControl<Cliente | null>(null, [Validators.required]),
      status: new FormControl<string | null>('TODAS', [Validators.required]),
      datas: this._fb.group({
        inicio: new FormControl<Date | null>(subDays(new Date(), 30), [Validators.required]),
        fim: new FormControl<Date | null>(new Date(), [Validators.required])
      })
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

  onFiltroInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();

    if (value === this.clientesConfig.clientesFiltro) {
      return;
    }

    clearTimeout(this.clientesConfig.filtroTimeout);

    this.clientesConfig.filtroTimeout = setTimeout(() => {
      this.clientesConfig.clientesFiltro = value;
      this.resetClientes();
      this.loadClientes();
    }, 400);
  }

  gerarRelatorio(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.loading.pdf = true;
    this.pdfUrl = null;

    const dados = {
      ...this.form.value,
      datas: {
        inicio: format(this.form.get('datas')?.get('inicio')?.value, 'yyyy-MM-dd'),
        fim: format(this.form.get('datas')?.get('fim')?.value, 'yyyy-MM-dd')
      }
    };

    this._http.post('http://localhost:8000/api/relatorios/por-cliente', dados, { responseType: 'arraybuffer' }).subscribe({
      next: (value: ArrayBuffer) => {
        this.pdfUrl = new Uint8Array(value);
        // const url = URL.createObjectURL(blob);
        // this.pdfUrl = url;
        // this.pdfUrl = this._sanitizer.bypassSecurityTrustResourceUrl(`${url}#toolbar=1&navpanes=0&scrollbar=0&zoom=page-width`);
        this.loading.pdf = false;
      },
      error: () => {
        this.pdfUrl = null;
        this.loading.pdf = false;
      }
    });
  }

  limpar(): void {
    this.form.reset({
      status: 'TODAS'
    });
    this.pdfUrl = null;
  }

  private loadEmpresas(): void {
    this.loading.empresas = true;
    this._empresasService.listar().subscribe({
      next: (data) => {
        this.listaEmpresas = data;
        this.form.get('empresas')?.patchValue(data.map((v) => v!.id));
        this.loading.empresas = false;
      },
      error: (err) => {
        this.loading.empresas = false;
        console.log(err);
      }
    });
  }

  onLazyLoadClientes(event: any): void {
    if (this.loading.clientes || !this.clientesConfig.clientesHasMore) {
      return;
    }

    const first = event.first ?? 0;

    if (first === this.clientesConfig.lastLazyFirst) {
      return;
    }

    this.clientesConfig.lastLazyFirst = first;

    const shouldLoadNextPage = first + this.clientesConfig.clientesPerPage >= this.listaClientes.length;

    if (!shouldLoadNextPage) {
      return;
    }

    this.loadClientes();
  }

  private loadClientes(): void {
    if (this.loading.clientes || !this.clientesConfig.clientesHasMore) {
      return;
    }

    this.loading.clientes = true;

    this._clientesService
      .listar({
        page: this.clientesConfig.clientesPage,
        per_page: this.clientesConfig.clientesPerPage,
        filter: this.clientesConfig.clientesFiltro || undefined,
        sort_by: 'nome_razaosocial',
        sort_dir: 'asc'
      })
      .subscribe({
        next: (response) => {
          const novos: Cliente[] = response.data ?? [];

          this.listaClientes = [...this.listaClientes, ...novos];

          if (this.clientesConfig.clientesPage >= response.last_page) {
            this.clientesConfig.clientesHasMore = false;
          } else {
            this.clientesConfig.clientesPage++;
          }

          this.loading.clientes = false;
        },
        error: () => {
          this.loading.clientes = false;
        }
      });
  }

  private resetClientes(): void {
    this.listaClientes = [];
    this.clientesConfig.clientesPage = 1;
    this.clientesConfig.clientesHasMore = true;
    this.clientesConfig.lastLazyFirst = 0;
  }
}
