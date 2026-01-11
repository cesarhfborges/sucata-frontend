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
import { ConfirmationService, MessageService } from 'primeng/api';
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
  private readonly _confirmationService = inject(ConfirmationService);

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
    this.modalNotaFiscal();
  }

  protected editar(value: NotaFiscal) {
    this.modalNotaFiscal(value);
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

  private modalNotaFiscal(nota?: NotaFiscal) {
    const modal = this._dialogService.open(CadastroNotaFiscal, {
      header: 'Cadastro NFE',
      modal: true,
      data: {
        cliente: this.dados!.cliente,
        notaFiscal: nota
      },
      width: '50vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
    modal.onClose.subscribe((value: NotaFiscal | null) => {
      if (!value) {
        return;
      }

      if (nota) {
        const index = this.lista.findIndex((n) => n.id === value.id);

        if (index !== -1) {
          this.lista[index] = value;
          this.lista = [...this.lista];
        }

        this._messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Nota fiscal atualizada com sucesso.',
          life: 3000
        });

        return;
      }

      this.lista.push(value);

      this._messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Nota fiscal cadastrada com sucesso.',
        life: 3000
      });
    });
  }

  private excluirEmpresa(id: number): void {
    this._notaFiscalService.delete(id).subscribe({
      next: (result) => {
        this.lista = this.lista.filter((v) => v.id !== id);
        this._messageService.add({ severity: 'info', summary: 'Sucesso', detail: result.message || 'Nota fiscal excluída com sucesso.' });
      }
    });
  }

  protected atualizar(nota: NotaFiscal) {
    this._notaFiscalService.get(nota.id!).subscribe({
      next: (nota) => {
        const index = this.lista.findIndex((n) => n.id === nota.id);

        if (index !== -1) {
          this.lista[index].pendente = nota.pendente;
          this.lista = [...this.lista];
        }
      }
    });
  }
}
