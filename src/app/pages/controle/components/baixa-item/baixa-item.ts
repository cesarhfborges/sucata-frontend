import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { Message } from 'primeng/message';
import { Ripple } from 'primeng/ripple';
import { ValidatorMessage } from '@/shared/components/validator-message/validator-message';
import { NotaFiscal } from '@/core/models/nota-fiscal';
import { ItemNota } from '@/core/models/item-nota';
import { NotaItensService } from '@/core/services/nota-itens-service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-baixa-item',
  imports: [Button, FormsModule, InputNumber, Message, ReactiveFormsModule, Ripple, ValidatorMessage],
  templateUrl: './baixa-item.html',
  styleUrl: './baixa-item.scss'
})
export class BaixaItem {
  notaFiscal: NotaFiscal;
  item: ItemNota;

  form: FormGroup;
  public submitted: boolean = false;

  configs = {
    max: 99999999999999,
    min: 1
  };

  private readonly _fb = inject(FormBuilder);
  private readonly _ref = inject(DynamicDialogRef);
  private readonly _messageService = inject(MessageService);
  private readonly _config = inject(DynamicDialogConfig);
  private readonly _notaItensService = inject(NotaItensService);

  constructor() {
    console.log(this._config.data);
    this.notaFiscal = this._config.data.notaFiscal;
    this.item = this._config.data.item;
    this.form = this._fb.group({
      quantidade: new FormControl<number>(1, [])
    });
    if (this._config.data.baixar) {
      this.configs.max = this.item.saldo_devedor;
    } else {
      this.configs.max = this.item.faturado - this.item.saldo_devedor;
    }
    this.form.get('quantidade')?.setValidators([Validators.required, Validators.min(this.configs.min), Validators.max(this.configs.max)]);
  }

  close(): void {
    this._ref.close(null);
  }

  protected salvar() {
    const dados = {
      quantidade: this.form.get('quantidade')?.value,
      acao: this._config.data.baixar ? 'baixar' : 'extornar'
    };
    this._notaItensService.movimentar(this.notaFiscal.id!, this.item.id!, dados).subscribe({
      next: (result) => {
        this._ref.close(result);
      },
      error: (err) => {
        this._messageService.add({
          severity: 'danger',
          summary: 'Ops',
          detail: 'Nao foi posssivel realizar esta acao.',
          life: 3000
        });
      }
    });
  }
}
