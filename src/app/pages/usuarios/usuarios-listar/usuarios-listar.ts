import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { DatePipe } from '@angular/common';
import { Button, ButtonDirective } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';
import { RouterLink } from '@angular/router';
import { Usuario } from '@/core/models/usuario';
import { UsuariosService } from '@/core/services/usuarios-service';
import { TableConfig } from '@/core/types/table-config';

@Component({
  selector: 'app-usuarios-listar',
  imports: [TableModule, CardModule, Tag, DatePipe, Button, ButtonGroup, RouterLink, ButtonDirective],
  templateUrl: './usuarios-listar.html',
  styleUrl: './usuarios-listar.scss'
})
export class UsuariosListar implements OnInit {
  protected tableConfig: TableConfig = {
    pagination: {
      rows: 10,
      options: [10, 25, 50]
    },
    sort: {
      field: 'nome',
      order: 1
    }
  };

  protected usuarios: Usuario[] = [];
  protected loading: boolean = false;

  private readonly _usuariosService = inject(UsuariosService);

  ngOnInit(): void {
    this.loading = true;
    this._usuariosService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      }
    });
  }
}
