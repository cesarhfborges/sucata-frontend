import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClientesService } from '@/core/services/clientes-service';
import { ButtonDirective, ButtonIcon, ButtonLabel } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { ValidatorMessage } from '@/shared/components/validator-message/validator-message';
import { MessageService } from 'primeng/api';
import { NgxLoaderIndicatorDirective } from 'ngx-loader-indicator';
import { listaUF } from '@/core/enums/uf';
import { NgxMaskDirective } from 'ngx-mask';
import { DatePipe } from '@angular/common';
import { Cliente } from '@/core/models/cliente';
import { CustomValidator } from '@/shared/components/custom-validator';

@Component({
  selector: 'app-clientes-editar',
  imports: [
    ButtonDirective,
    ButtonIcon,
    ButtonLabel,
    Card,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    Select,
    Textarea,
    ValidatorMessage,
    NgxLoaderIndicatorDirective,
    RouterModule,
    NgxMaskDirective,
    DatePipe
  ],
  templateUrl: './clientes-editar.html',
  styleUrl: './clientes-editar.scss'
})
export class ClientesEditar implements OnInit {
  loading: boolean = false;
  clienteId: number | null = null;
  cliente: Cliente | undefined;

  form: FormGroup;

  listaUF = listaUF;

  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _messageService = inject(MessageService);
  private readonly _clienteService = inject(ClientesService);

  constructor() {
    this.form = this._fb.group({
      nome_razaosocial: new FormControl<string | null>(null, [Validators.required]),
      sobrenome_nomefantasia: new FormControl<string | null>(null, [Validators.required]),
      cpf_cnpj: new FormControl<string | null>(null, [Validators.required, CustomValidator.validateCpfCnpj]),
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
    const id = Number(this._route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.clienteId = id;
    }

    if (this.clienteId !== null) {
      this.loading = true;
      this._clienteService.get(this.clienteId).subscribe({
        next: (res) => {
          this.cliente = res;
          this.form.patchValue(res);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  protected onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      if (this.clienteId !== null) {
        this._clienteService.atualizar(this.clienteId, this.form.value).subscribe({
          next: (res) => {
            this._messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Alterações salvas.', life: 3000 });
            this.cliente = res;
            this.form.patchValue(res);
          },
          error: (err) => {
            console.error(err);
          }
        });
      } else {
        this._clienteService.cadastrar(this.form.value).subscribe({
          next: (res) => {
            this.form.patchValue(res);
            this.clienteId = res.id!;
            this.cliente = res;
            this._messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cadastro efetuado.', life: 3000 });
            void this._router.navigate(['/clientes', res.id], { replaceUrl: true });
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
