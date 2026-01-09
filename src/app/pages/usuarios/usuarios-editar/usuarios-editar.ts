import { Component, inject, OnInit } from '@angular/core';
import { ButtonDirective, ButtonIcon, ButtonLabel } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { JsonPipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorMessage } from '@/shared/components/validator-message/validator-message';
import { NgxLoaderIndicatorDirective } from 'ngx-loader-indicator';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { UsuariosService } from '@/core/services/usuarios-service';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { CustomValidator } from '@/shared/components/custom-validator';
import { Message } from 'primeng/message';
import { findInvalidControls } from '@/shared/utils/find-invalid-controls';

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
    DividerModule,
    IconField,
    InputIcon,
    Message
  ],
  templateUrl: './usuarios-editar.html',
  styleUrl: './usuarios-editar.scss'
})
export class UsuariosEditar implements OnInit {
  loading = false;
  usuarioId: number | undefined;
  form: FormGroup;

  private readonly _fb = inject(FormBuilder);
  private readonly _route = inject(ActivatedRoute);
  private readonly _messageService = inject(MessageService);
  private readonly _usuariosService = inject(UsuariosService);

  constructor() {
    this.form = this._fb.group(
      {
        nome: new FormControl<string | null>(null, [Validators.required]),
        sobrenome: new FormControl<string | null>(null, [Validators.required]),
        email: new FormControl<string | null>(null, {
          validators: [Validators.required, Validators.email],
          asyncValidators: [CustomValidator.checkEmailAvailability(this._usuariosService, () => this.usuarioId)]
        }),
        password: new FormControl<string | null>(null, []),
        confirmPassword: new FormControl<string | null>(null, []),
        ativo: new FormControl<boolean>(true, [Validators.required])
      },
      { validators: CustomValidator.passwordMatchValidator('password', 'confirmPassword') }
    );
  }
  ngOnInit(): void {
    const id = Number(this._route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.usuarioId = id;
    }

    if (this.usuarioId && !isNaN(this.usuarioId)) {
      this.loading = true;
      this._usuariosService.get(this.usuarioId).subscribe({
        next: (res) => {
          console.log(res);
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

  getEmailIcon(): string {
    const control = this.form.get('email');
    if (!control || control.pristine) return '';

    if (control.pending) return 'pi pi-spin pi-spinner text-warn';
    if (control.valid) return 'pi pi-check text-success';
    if (control.invalid) return 'pi pi-ban text-error';
    return '';
  }

  invalids(): any {
    return findInvalidControls(this.form);
  }

  protected onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      if (this.usuarioId) {
        this._messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuario cadastrado com sucesso.', life: 3000 });
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
        this._messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuario atualizado com sucesso.', life: 3000 });
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
