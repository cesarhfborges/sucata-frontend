import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RouterModule } from '@angular/router';
import { Empresa } from '@/core/models/empresa';
import { NgxMaskPipe } from 'ngx-mask';
import { Skeleton } from 'primeng/skeleton';
import { EmpresaService } from '@/core/services/empresa-service';

interface ITableConfig {
  pagination: {
    rows: number;
    options: number[];
  };
}

@Component({
  selector: 'app-empresas-listar',
  imports: [ButtonModule, ButtonGroupModule, CardModule, TableModule, TagModule, RouterModule, NgxMaskPipe, Skeleton],
  templateUrl: './empresas-listar.html',
  styleUrl: './empresas-listar.scss'
})
export class EmpresasListar implements OnInit {
  loading = false;
  empresas: Empresa[] = [];

  protected tableConfig: ITableConfig = {
    pagination: {
      rows: 10,
      options: [10, 25, 50]
    }
  };

  private readonly _service = inject(EmpresaService);

  ngOnInit(): void {
    this.loading = true;
    this._service.listar().subscribe({
      next: (result) => {
        console.log(result);
        this.empresas = result;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error(error);
      }
    });
  }
}
