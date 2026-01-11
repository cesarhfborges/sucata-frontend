import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NotaItensService } from '@/core/services/nota-itens-service';
import { format, parse } from 'date-fns';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { JsonPipe } from '@angular/common';
import { Message } from 'primeng/message';
import { Ripple } from 'primeng/ripple';
import { Select } from 'primeng/select';
import { ValidatorMessage } from '@/shared/components/validator-message/validator-message';
import { MateriaisService } from '@/core/services/materiais-service';
import { NotaFiscal } from '@/core/models/nota-fiscal';
import { CustomValidator } from '@/shared/components/custom-validator';

@Component({
  selector: 'app-cadastro-nota-fiscal-item',
  imports: [Button, DatePicker, FormsModule, InputNumber, JsonPipe, Message, ReactiveFormsModule, Ripple, Select, ValidatorMessage],
  templateUrl: './cadastro-nota-fiscal-item.html',
  styleUrl: './cadastro-nota-fiscal-item.scss'
})
export class CadastroNotaFiscalItem implements OnInit {
  public form: FormGroup;
  public submitted: boolean = false;
  listaMateriais: any[] = [];
  protected loading = {
    produtos: false
  };
  protected notaFiscal: NotaFiscal;

  private readonly _fb = inject(FormBuilder);
  private readonly _ref = inject(DynamicDialogRef);
  private readonly _config = inject(DynamicDialogConfig);
  private readonly _notaItensService = inject(NotaItensService);
  private readonly _materiaisService = inject(MateriaisService);

  constructor() {
    this.notaFiscal = this._config.data.notaFiscal;
    console.log(this._config.data);
    this.form = this._fb.group(
      {
        material_id: new FormControl<number | null>(null, [Validators.required]),
        faturado: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
        saldo_devedor: new FormControl<string | null>(null, [Validators.required, Validators.min(0)])
      },
      {
        validators: [CustomValidator.menorOuIgualValidator('faturado', 'saldo_devedor')]
      }
    );
    if (this._config.data.item) {
      this.form.patchValue({
        material_id: this._config.data.item.material_id,
        faturado: this._config.data.item.faturado,
        saldo_devedor: this._config.data.item.saldo_devedor
      });
    }
  }

  ngOnInit(): void {
    this.loadMateriais();
  }

  close(): void {
    this._ref.close(null);
  }

  protected salvar(): void {
    this.submitted = true;
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const dados = this.form.value;

      if (this._config.data.item) {
        this._notaItensService.atualizar(this._config.data.notaFiscal.id, this._config.data.item.id, dados).subscribe({
          next: (data) => {
            console.log(data);
            this._ref.close(data);
          },
          error: (error) => {
            console.log(error);
          }
        });
      } else {
        this._notaItensService.cadastrar(this._config.data.notaFiscal.id, dados).subscribe({
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

  private loadMateriais(): void {
    this.loading.produtos = true;
    this._materiaisService.listar().subscribe({
      next: (data) => {
        this.listaMateriais = data;
        this.loading.produtos = false;
      },
      error: (error) => {
        console.log(error);
        this.loading.produtos = false;
      }
    });
  }
}
