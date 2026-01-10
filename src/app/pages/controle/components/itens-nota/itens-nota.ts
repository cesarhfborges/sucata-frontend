import { Component, inject, OnInit } from '@angular/core';
import { Card } from 'primeng/card';
import { NotaItensService } from '@/core/services/nota-itens-service';
import { DatePipe, JsonPipe } from '@angular/common';
import { Button } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';
import { TableModule } from 'primeng/table';
import { ItemNota } from '@/core/models/item-nota';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-itens-nota',
  imports: [Card, JsonPipe, Button, ButtonGroup, TableModule, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './itens-nota.html',
  styleUrl: './itens-nota.scss'
})
export class ItensNota implements OnInit {
  loading: boolean = false;
  lista: ItemNota[] = [];

  private readonly _notaItensService = inject(NotaItensService);

  ngOnInit(): void {
    this._notaItensService.listar(1).subscribe({
      next: (data) => {
        console.log(data);
        this.lista = data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  protected editar(id: number) {}

  protected delete($event: any, id: number) {}
}
