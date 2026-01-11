import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Card } from 'primeng/card';
import { NotaItensService } from '@/core/services/nota-itens-service';
import { Button, ButtonDirective, ButtonIcon, ButtonLabel } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';
import { TableModule } from 'primeng/table';
import { ItemNota } from '@/core/models/item-nota';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CadastroNotaFiscalItem } from '@/pages/controle/components/cadastro-nota-fiscal-item/cadastro-nota-fiscal-item';
import { NotaFiscal } from '@/core/models/nota-fiscal';

@Component({
  selector: 'app-itens-nota',
  imports: [Card, Button, ButtonGroup, TableModule, IconFieldModule, InputIconModule, InputTextModule, ButtonDirective, ButtonIcon, ButtonLabel],
  templateUrl: './itens-nota.html',
  styleUrl: './itens-nota.scss'
})
export class ItensNota implements OnChanges {
  @Input({ required: true })
  notaFiscal!: NotaFiscal;

  @Output('changed')
  onChanged: EventEmitter<NotaFiscal> = new EventEmitter();

  loading: boolean = false;
  lista: ItemNota[] = [];
  public readonly _dialogService = inject(DialogService);
  private readonly _notaItensService = inject(NotaItensService);
  private readonly _messageService = inject(MessageService);
  private readonly _confirmationService = inject(ConfirmationService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['notaFiscal'] && this.notaFiscal) {
      this.lista = [];
      this.loadItens(this.notaFiscal.id!);
    }
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

  protected cadastro(): void {
    this.modalNotaFiscal();
  }

  protected editar(value: ItemNota) {
    this.modalNotaFiscal(value);
  }

  private loadItens(id: number): void {
    this.loading = true;
    this._notaItensService.listar(id).subscribe({
      next: (data) => {
        console.log(data);
        this.lista = data;
        this.loading = false;
        this._scrollToBottom();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      }
    });
  }

  private modalNotaFiscal(item?: ItemNota) {
    const modal = this._dialogService.open(CadastroNotaFiscalItem, {
      header: 'Cadastro itens',
      modal: true,
      data: {
        notaFiscal: this.notaFiscal,
        item: item
      },
      width: '50vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
    modal.onClose.subscribe((value: ItemNota | null) => {
      if (!value) {
        return;
      }
      this.atualizar();
      if (item) {
        const index = this.lista.findIndex((n) => n.id === value.id);

        if (index !== -1) {
          this.lista[index] = value;
          this.lista = [...this.lista];
        }

        this._messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Item atualizado com sucesso.',
          life: 3000
        });

        return;
      }

      this.lista.push(value);

      this._messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Item cadastrado com sucesso.',
        life: 3000
      });
    });
  }

  private _scrollToBottom(): void {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }

  private excluirEmpresa(id: number): void {
    this._notaItensService.delete(this.notaFiscal.id!, id).subscribe({
      next: (result) => {
        this.lista = this.lista.filter((v) => v.id !== id);
        this._messageService.add({ severity: 'info', summary: 'Sucesso', detail: result.message || 'Item excluído com sucesso.' });
      }
    });
  }

  atualizar(): void {
    this.onChanged.emit(this.notaFiscal);
  }
}
