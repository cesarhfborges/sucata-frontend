import { Component, inject, OnInit } from '@angular/core';
import { SessionService } from '@/core/services/session-service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ValidatorMessage } from '@/shared/components/validator-message/validator-message';
import { NgxLoaderIndicatorDirective } from 'ngx-loader-indicator';
import { RouterLink } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { CustomValidator } from '@/shared/components/custom-validator';
import { findInvalidControls } from '@/shared/utils/find-invalid-controls';
import { UsuariosService } from '@/core/services/usuarios-service';
import { Usuario } from '@/core/models/usuario';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '@/core/services/auth-service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-perfil',
  imports: [
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    CardModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    ValidatorMessage,
    NgxLoaderIndicatorDirective,
    RouterLink,
    PasswordModule,
    TooltipModule,
    MessageModule,
    DividerModule
  ],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss'
})
export class Perfil implements OnInit {
  loading: boolean = false;
  form: FormGroup;
  perfil: Usuario | null = null;

  private readonly _fb = inject(FormBuilder);
  private readonly _session = inject(SessionService);
  private readonly _authService = inject(AuthService);
  private readonly _usuariosService = inject(UsuariosService);
  private readonly _messageService = inject(MessageService);

  constructor() {
    this.form = this._fb.group(
      {
        nome: new FormControl<string | null>(null, [Validators.required]),
        sobrenome: new FormControl<string | null>(null, [Validators.required]),

        email: new FormControl<string | null>(
          null,
          [Validators.required, Validators.email],
          [CustomValidator.checkEmailAvailability(this._usuariosService, () => this.perfil?.id)]
        ),
        password: new FormControl<string | null>(null, []),
        confirmPassword: new FormControl<string | null>(null, [])
      },
      { validators: CustomValidator.passwordMatchValidator('password', 'confirmPassword') }
    );
  }

  ngOnInit() {
    const p = this._session.perfil();
    if (p) {
      this.perfil = p;
      this.form.patchValue(p);
      this.form.updateValueAndValidity();
    }
  }

  invalids(): any {
    return findInvalidControls(this.form);
  }

  getEmailIcon(): string {
    const control = this.form.get('email');
    if (!control || control.pristine) return '';

    if (control.pending) return 'pi pi-spin pi-spinner text-warn';
    if (control.valid) return 'pi pi-check text-success';
    if (control.invalid) return 'pi pi-ban text-error';
    return '';
  }

  protected onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.loading = true;
      this._authService.updatePerfil(this.form.value).subscribe({
        next: (value) => {
          console.log(value);
          this._messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Perfil atualizado com sucesso.', life: 3000 });
          this.loading = false;
        },
        error: (e) => {
          console.error(e);
          this.loading = false;
        }
      });
    } else {
      console.error('Invalid');
    }
  }
}
