import { Component, inject } from '@angular/core';
import { ButtonDirective, ButtonIcon, ButtonLabel } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { JsonPipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorMessage } from '@/shared/components/validator-message/validator-message';
import { NgxLoaderIndicatorDirective } from 'ngx-loader-indicator';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-usuarios-editar',
  imports: [
    ButtonDirective,
    ButtonIcon,
    ButtonLabel,
    Card,
    PasswordModule,
    InputText,
    JsonPipe,
    ReactiveFormsModule,
    ToggleSwitchModule,
    ValidatorMessage,
    NgxLoaderIndicatorDirective,
    RouterLink,
    DividerModule
  ],
  templateUrl: './usuarios-editar.html',
  styleUrl: './usuarios-editar.scss'
})
export class UsuariosEditar {
  loading = false;
  usuarioId: number | null = null;
  form: FormGroup;

  private readonly _fb = inject(FormBuilder);
  private readonly _messageService = inject(MessageService);

  constructor() {
    this.form = this._fb.group({
      nome: new FormControl<string | null>(null, [Validators.required]),
      sobrenome: new FormControl<string | null>(null, [Validators.required]),
      email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
      ativo: new FormControl<boolean>(true, [Validators.required]),
      password: new FormControl<string | null>(null, [Validators.required])
    });
  }

  protected onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      if (this.usuarioId !== null) {
        // this._service.atualizar(this.empresaId, this.form.value).subscribe({
        //   next: (res) => {
        //     this._messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Alterações salvas.', life: 3000 });
        //     this.form.patchValue(res);
        //   },
        //   error: (err) => {
        //     console.error(err);
        //   }
        // });
      } else {
        // this._service.cadastrar(this.form.value).subscribe({
        //   next: (res) => {
        //     this.form.patchValue(res);
        //     this.empresaId = res.id!;
        //     this._messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cadastro efetuado.', life: 3000 });
        //     void this._router.navigate(['/empresas', res.id], { replaceUrl: true });
        //   },
        //   error: (err) => {
        //     console.error(err);
        //   }
        // });
      }
    } else {
      this._messageService.add({ severity: 'error', summary: 'Ops', detail: 'Verifique os campos e tente novamente.', life: 3000 });
    }
  }
}
