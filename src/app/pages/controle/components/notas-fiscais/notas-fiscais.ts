import { Component, inject, Input, OnInit } from '@angular/core';
import { Card } from 'primeng/card';
import { Button, ButtonModule } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ItensNota } from '@/pages/controle/components/itens-nota/itens-nota';
import { NotaFiscalService } from '@/core/services/nota-fiscal-service';
import { NotaFiscal } from '@/core/models/nota-fiscal';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { OnClickClear } from '@/shared/directives/on-click-clear';
import { OnClickIgnore } from '@/shared/directives/on-click-ignore';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { RippleModule } from 'primeng/ripple';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { CadastroNotaFiscal } from '@/pages/controle/components/cadastro-nota-fiscal/cadastro-nota-fiscal';
import { MessageService } from 'primeng/api';
import { Cliente } from '@/core/models/cliente';
import { Empresa } from '@/core/models/empresa';

interface IDados {
  cliente: Cliente;
  empresas: Empresa[];
  status: 'TODAS' | 'PENDENTE' | 'DEVOLVIDA';
}

@Component({
  selector: 'app-notas-fiscais',
  imports: [
    Card,
    Button,
    ButtonGroup,
    DatePipe,
    TableModule,
    ItensNota,
    InputGroupModule,
    InputGroupAddonModule,
    IconField,
    InputIcon,
    InputText,
    OnClickClear,
    OnClickIgnore,
    ButtonModule,
    RippleModule,
    DynamicDialogModule
  ],
  providers: [DialogService],
  templateUrl: './notas-fiscais.html',
  styleUrl: './notas-fiscais.scss'
})
export class NotasFiscais implements OnInit {
  @Input() dados: IDados | null = null;

  loading: boolean = false;
  metaKey: boolean = true;
  selecionado: NotaFiscal | undefined;
  lista: NotaFiscal[] = [];

  public readonly _dialogService = inject(DialogService);
  private readonly _messageService = inject(MessageService);
  private readonly _notaFiscalService = inject(NotaFiscalService);

  ngOnInit() {
    this.loading = true;
    this._notaFiscalService
      .listar({
        empresas: this.dados!.empresas.map((e) => e.id!),
        cliente: this.dados!.cliente.id,
        status: this.dados!.status
      })
      .subscribe({
        next: (data) => {
          console.log('NotasFiscais: ', data);
          this.lista = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('NotasFiscais: ', err);
          this.loading = false;
        }
      });
  }

  protected cadastro(): void {
    const modal = this._dialogService.open(CadastroNotaFiscal, {
      header: 'Cadastro',
      modal: true,
      data: {
        cliente: this.dados!.cliente
      },
      width: '50vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
    modal.onClose.subscribe(() => {
      this._messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Nota fiscal cadastrada com sucesso.', life: 3000 });
    });
  }

  protected editar(id: number) {
    console.log('editar CLICK');
  }

  protected delete($event: any, id: number) {}
}
