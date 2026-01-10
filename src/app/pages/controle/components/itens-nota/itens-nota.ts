import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Card } from 'primeng/card';
import { NotaItensService } from '@/core/services/nota-itens-service';
import { Button, ButtonDirective } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';
import { TableModule } from 'primeng/table';
import { ItemNota } from '@/core/models/item-nota';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-itens-nota',
  imports: [Card, Button, ButtonGroup, TableModule, IconFieldModule, InputIconModule, InputTextModule, ButtonDirective],
  templateUrl: './itens-nota.html',
  styleUrl: './itens-nota.scss'
})
export class ItensNota implements OnChanges {
  @Input({ required: true })
  notaFiscal!: number | undefined;

  loading: boolean = false;
  lista: ItemNota[] = [];

  private readonly _notaItensService = inject(NotaItensService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['notaFiscal'] && this.notaFiscal) {
      this.lista = [];
      this.loadItens(this.notaFiscal);
    }
  }

  protected editar(id: number) {}

  protected delete($event: any, id: number) {}

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

  private _scrollToBottom(): void {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }
}
