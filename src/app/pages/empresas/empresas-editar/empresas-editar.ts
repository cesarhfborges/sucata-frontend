import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { JsonPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { listaUF } from '@/core/enums/uf';
import { TextareaModule } from 'primeng/textarea';
import { EmpresaService } from '@/core/services/empresa-service';
import { ValidatorMessage } from '@/shared/components/validator-message/validator-message';
import { MessageService } from 'primeng/api';
import { NgxLoaderIndicatorDirective } from 'ngx-loader-indicator';

@Component({
  selector: 'app-empresas-editar',
  imports: [
    CardModule,
    ReactiveFormsModule,
    InputTextModule,
    InputMaskModule,
    JsonPipe,
    ButtonModule,
    RouterLink,
    SelectModule,
    TextareaModule,
    ValidatorMessage,
    NgxLoaderIndicatorDirective
  ],
  templateUrl: './empresas-editar.html',
  styleUrl: './empresas-editar.scss'
})
export class EmpresasEditar implements OnInit {
  loading = false;
  empresaId: number | null = null;
  form: FormGroup;

  listaUF = listaUF;

  private readonly _fb = inject(FormBuilder);
  private readonly _route = inject(ActivatedRoute);
  private readonly _service = inject(EmpresaService);
  private readonly _messageService = inject(MessageService);

  constructor() {
    this.form = this._fb.group({
      razao_social: new FormControl<string | null>(null, [Validators.required]),
      nome_fantasia: new FormControl<string | null>(null, [Validators.required]),
      cnpj: new FormControl<string | null>(null, [Validators.required]),
      cep: new FormControl<string | null>(null, []),
      logradouro: new FormControl<string | null>(null, []),
      numero: new FormControl<string | null>(null, []),
      complemento: new FormControl<string | null>(null, []),
      bairro: new FormControl<string | null>(null, []),
      cidade: new FormControl<string | null>(null, []),
      uf: new FormControl<string | null>(null, [ValidatorMessage.UF]),
      telefone: new FormControl<string | null>(null, []),
      email: new FormControl<string | null>(null, []),
      observacoes: new FormControl<string | null>(null, [])
    });
  }

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');

    this.empresaId = id ? +id : null;

    if (this.empresaId && !isNaN(this.empresaId)) {
      this.loading = true;
      this._service.get(this.empresaId).subscribe({
        next: (res) => {
          console.log(res);
          this.form.patchValue(res);
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
        }
      });
    }
  }

  protected onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      if (this.empresaId !== null) {
        this._service.atualizar(this.empresaId, this.form.value).subscribe({
          next: (res) => {
            this._messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Alterações salvas.', life: 3000 });
          },
          error: (err) => {}
        });
      } else {
        this._service.cadastrar(this.form.value).subscribe({
          next: (res) => {},
          error: (err) => {}
        });
      }
    }
  }
}
