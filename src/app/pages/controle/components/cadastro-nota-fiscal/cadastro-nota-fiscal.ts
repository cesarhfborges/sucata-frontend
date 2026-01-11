import { Component, inject, OnInit } from '@angular/core';
import { EmpresaService } from '@/core/services/empresa-service';
import { Empresa } from '@/core/models/empresa';
import { SelectModule } from 'primeng/select';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { ValidatorMessage } from '@/shared/components/validator-message/validator-message';
import { RippleModule } from 'primeng/ripple';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { Cliente } from '@/core/models/cliente';
import { JsonPipe } from '@angular/common';
import { NotaFiscalService } from '@/core/services/nota-fiscal-service';
import { format, parse } from 'date-fns';

@Component({
  selector: 'app-cadastro-nota-fiscal',
  imports: [
    SelectModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    DatePickerModule,
    MessageModule,
    RippleModule,
    ButtonModule,
    ValidatorMessage,
    InputNumberModule,
    JsonPipe
  ],
  providers: [DialogService],
  templateUrl: './cadastro-nota-fiscal.html',
  styleUrl: './cadastro-nota-fiscal.scss'
})
export class CadastroNotaFiscal implements OnInit {
  form: FormGroup;
  listaEmpresas: Empresa[] = [];
  public submitted: boolean = false;
  protected cliente!: Cliente;
  protected loading = {
    empresas: false
  };
  private readonly _fb = inject(FormBuilder);
  private readonly _ref = inject(DynamicDialogRef);
  private readonly _config = inject(DynamicDialogConfig);
  private readonly _notaFiscalService = inject(NotaFiscalService);
  private readonly _empresasService = inject(EmpresaService);

  constructor() {
    this.cliente = this._config.data.cliente;
    console.log(this._config.data);
    this.form = this._fb.group({
      empresa_id: new FormControl<number | null>(null, [Validators.required]),
      nota_fiscal: new FormControl<number | null>(null, [Validators.required]),
      serie: new FormControl<string | null>(null, [Validators.required]),
      emissao: new FormControl<string | null>(null, [Validators.required])
    });
    if (this._config.data.notaFiscal) {
      this.form.patchValue({
        empresa_id: this._config.data.notaFiscal.empresa_id,
        nota_fiscal: this._config.data.notaFiscal.nota_fiscal,
        serie: this._config.data.notaFiscal.serie,
        emissao: parse(this._config.data.notaFiscal.emissao, 'yyyy-MM-dd', new Date())
      });
    }
  }

  ngOnInit(): void {
    this.loadEmpresas();
  }

  close(): void {
    this._ref.close(null);
  }

  protected salvar(): void {
    this.submitted = true;
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const dados = {
        ...this.form.value,
        emissao: format(this.form.get('emissao')!.value, 'yyyy-MM-dd'),
        cliente_id: this.cliente.id
      };

      if (this._config.data.notaFiscal) {
        this._notaFiscalService.atualizar(this._config.data.notaFiscal.id, dados).subscribe({
          next: (data) => {
            console.log(data);
            this._ref.close(data);
          },
          error: (error) => {
            console.log(error);
          }
        });
      } else {
        this._notaFiscalService.cadastrar(dados).subscribe({
          next: (data) => {
            console.log(data);
            this._ref.close(data);
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
      console.log('Valido');
    } else {
      console.log('Invalido');
    }
  }

  private loadEmpresas(): void {
    this.loading.empresas = true;
    this._empresasService.listar().subscribe({
      next: (data) => {
        this.listaEmpresas = data;
        // this.form.get('empresas')?.patchValue(data.map((e) => e.id!));
        this.loading.empresas = false;
      },
      error: (error) => {
        this.loading.empresas = false;
      }
    });
  }
}
