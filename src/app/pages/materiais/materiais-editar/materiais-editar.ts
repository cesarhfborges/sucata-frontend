import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ValidatorMessage } from '@/shared/components/validator-message/validator-message';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxLoaderIndicatorDirective } from 'ngx-loader-indicator';
import { MateriaisService } from '@/core/services/materiais-service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Material } from '@/core/models/material';
import { KeyFilter } from 'primeng/keyfilter';

@Component({
  selector: 'app-materiais-editar',
  imports: [ValidatorMessage, RouterModule, NgxLoaderIndicatorDirective, CardModule, ReactiveFormsModule, InputTextModule, ButtonModule, SelectModule, DatePipe, KeyFilter],
  templateUrl: './materiais-editar.html',
  styleUrl: './materiais-editar.scss'
})
export class MateriaisEditar implements OnInit {
  loading = false;
  materialId: string | null = null;
  material: Material | undefined;
  form: FormGroup;

  blockSpecial: RegExp = /[a-zA-Z0-9-_]/;

  private readonly _fb = inject(FormBuilder);
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _messageService = inject(MessageService);
  private readonly _materiaisService = inject(MateriaisService);

  constructor() {
    this.form = this._fb.group({
      codigo: new FormControl<string | null>(null, [Validators.required, Validators.pattern(/^[A-Z0-9-_]*$/)]),
      descricao: new FormControl<string | null>(null, [Validators.required]),
      un: new FormControl<string | null>(null, [Validators.required, Validators.minLength(1), Validators.maxLength(3)])
    });
  }

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id !== null && id !== 'novo') {
      this.materialId = id;
      this.loading = true;
      this._materiaisService.get(this.materialId).subscribe({
        next: (res) => {
          console.log(res);
          this.material = res;
          this.form.patchValue(res);
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  protected onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      if (this.materialId !== null) {
        this._materiaisService.atualizar(this.materialId, this.form.value).subscribe({
          next: (res) => {
            this._messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Alterações salvas.', life: 3000 });
            this.material = res;
            this.form.patchValue(res);
          },
          error: (err) => {
            console.error(err);
          }
        });
      } else {
        this._materiaisService.cadastrar(this.form.value).subscribe({
          next: (res) => {
            this.form.patchValue(res);
            this.materialId = res.codigo!;
            this.material = res;
            this._messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cadastro efetuado.', life: 3000 });
            void this._router.navigate(['/materiais', res.codigo], { replaceUrl: true });
          },
          error: (err) => {
            console.error(err);
          }
        });
      }
    } else {
      this._messageService.add({ severity: 'error', summary: 'Ops', detail: 'Verifique os campos e tente novamente.', life: 3000 });
    }
  }
}
