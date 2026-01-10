import { Component, inject, Input, OnInit } from '@angular/core';
import { Card } from 'primeng/card';
import { Button, ButtonModule } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';
import { DatePipe, JsonPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
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

@Component({
  selector: 'app-notas-fiscais',
  imports: [Card, Button, ButtonGroup, DatePipe, TableModule, Tag, ItensNota, InputGroupModule, InputGroupAddonModule, IconField, InputIcon, InputText, OnClickClear, OnClickIgnore, ButtonModule, RippleModule],
  templateUrl: './notas-fiscais.html',
  styleUrl: './notas-fiscais.scss'
})
export class NotasFiscais implements OnInit {
  @Input() dados: any = null;

  loading: boolean = false;
  metaKey: boolean = true;
  selecionado: NotaFiscal | undefined;
  lista: NotaFiscal[] = [];

  private readonly _notaFiscalService = inject(NotaFiscalService);

  ngOnInit() {
    this.loading = true;
    this._notaFiscalService
      .listar({
        empresas: this.dados.empresas,
        cliente: this.dados.cliente,
        status: this.dados.status,
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

  protected editar(id: number) {
    console.log('editar CLICK');
  }

  protected delete($event: any, id: number) {}

  protected readonly console = console;
}
