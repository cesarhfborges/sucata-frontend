import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NotaItensService } from '@/core/services/nota-itens-service';
import { Button } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { Message } from 'primeng/message';
import { Ripple } from 'primeng/ripple';
import { Select } from 'primeng/select';
import { ValidatorMessage } from '@/shared/components/validator-message/validator-message';
import { MateriaisService } from '@/core/services/materiais-service';
import { NotaFiscal } from '@/core/models/nota-fiscal';
import { CustomValidator } from '@/shared/components/custom-validator';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Material } from '@/core/models/material';
import { ScrollerOptions } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { ItemNota } from '@/core/models/item-nota';

@Component({
  selector: 'app-cadastro-nota-fiscal-item',
  imports: [Button, FormsModule, InputNumber, Message, ReactiveFormsModule, Ripple, Select, ValidatorMessage, IconFieldModule, InputIconModule, InputTextModule, DatePipe],
  templateUrl: './cadastro-nota-fiscal-item.html',
  styleUrl: './cadastro-nota-fiscal-item.scss'
})
export class CadastroNotaFiscalItem implements OnInit {
  public form: FormGroup;
  public submitted: boolean = false;
  listaMateriais: Material[] = [];
  protected loading = {
    produtos: false
  };
  protected notaFiscal: NotaFiscal;
  protected notaFiscalItem: ItemNota | undefined;

  protected materiaisFiltro = '';
  private materiaisPage = 1;
  private readonly materiaisPerPage = 50;
  private materiaisHasMore = true;
  private lastMateriaisFirst = 0;
  private filtroMateriaisTimeout: any = null;

  optionsMateriais: ScrollerOptions = {
    lazy: true,
    showLoader: true,
    delay: 0,
    onLazyLoad: this.onLazyLoadMateriais.bind(this)
  };

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
      this.notaFiscalItem = this._config.data.item;
      this.form.patchValue({
        material_id: this._config.data.item.material_id,
        faturado: this._config.data.item.faturado,
        saldo_devedor: this._config.data.item.saldo_devedor
      });
    }
  }

  ngOnInit(): void {
    if (this._config.data.item?.material_id) {
      this.loadMaterialSelecionado(this._config.data.item.material_id);
    }
  }

  close(): void {
    this._ref.close(null);
  }

  onOpenMateriais(): void {
    if (this.loading.produtos) {
      return;
    }

    if (this.materiaisPage === 1 && this.listaMateriais.length <= 1) {
      this.loadMateriais();
    }
  }

  onLazyLoadMateriais(event: any): void {
    if (this.loading.produtos || !this.materiaisHasMore) {
      return;
    }

    const first = event.first ?? 0;

    if (first === this.lastMateriaisFirst) {
      return;
    }

    this.lastMateriaisFirst = first;

    const shouldLoadNext = first + this.materiaisPerPage >= this.listaMateriais.length;

    if (!shouldLoadNext) {
      return;
    }

    this.loadMateriais();
  }

  onFiltroMateriais(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();

    if (value === this.materiaisFiltro) {
      return;
    }

    clearTimeout(this.filtroMateriaisTimeout);

    this.filtroMateriaisTimeout = setTimeout(() => {
      this.materiaisFiltro = value;
      this.resetMateriais();
      this.loadMateriais();
    }, 400);
  }

  private loadMateriais(): void {
    if (this.loading.produtos || !this.materiaisHasMore) {
      return;
    }

    this.loading.produtos = true;

    this._materiaisService
      .listar({
        page: this.materiaisPage,
        per_page: this.materiaisPerPage,
        filter: this.materiaisFiltro || undefined,
        sort_by: 'descricao',
        sort_dir: 'asc'
      })
      .subscribe({
        next: (response) => {
          const novos: Material[] = response.data ?? [];

          this.mergeMateriais(novos);

          if (this.materiaisPage >= response.last_page) {
            this.materiaisHasMore = false;
          } else {
            this.materiaisPage++;
          }

          this.loading.produtos = false;
        },
        error: () => {
          this.loading.produtos = false;
        }
      });
  }

  private loadMaterialSelecionado(codigo: string): void {
    this.loading.produtos = true;

    this._materiaisService.get(codigo).subscribe({
      next: (material) => {
        this.mergeMateriais([material]);
        this.loading.produtos = false;
      },
      error: () => {
        this.loading.produtos = false;
      }
    });
  }

  private mergeMateriais(novos: Material[]): void {
    const map = new Map<string, Material>();

    for (const m of this.listaMateriais) {
      map.set(m.codigo, m);
    }

    for (const m of novos) {
      map.set(m.codigo, m);
    }

    this.listaMateriais = Array.from(map.values());
  }

  private resetMateriais(): void {
    const selecionadoCodigo = this.form.get('material_id')?.value;

    this.listaMateriais = selecionadoCodigo ? this.listaMateriais.filter((m) => m.codigo === selecionadoCodigo) : [];

    this.materiaisPage = 1;
    this.materiaisHasMore = true;
    this.lastMateriaisFirst = 0;
  }

  protected salvar(): void {
    this.submitted = true;
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const dados = this.form.value;

      if (this._config.data.item) {
        this._notaItensService.atualizar(this._config.data.notaFiscal.id, this._config.data.item.id, dados).subscribe({
          next: (data) => {
            this.notaFiscalItem = data;
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
            this.notaFiscalItem = data;
            this._ref.close(data);
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    } else {
      console.log('Invalido');
    }
  }
}
