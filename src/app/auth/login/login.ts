import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '@/layout/component/app.floatingconfigurator';
import { NgOptimizedImage } from '@angular/common';
import { SessionService } from '@/core/services/session-service';
import { AuthService } from '@/core/services/auth-service';
import { NgxLoaderIndicatorDirective } from 'ngx-loader-indicator';
import { ValidatorMessage } from '@/shared/components/validator-message/validator-message';
import { MessageService } from 'primeng/api';
import { AutoFocusModule } from 'primeng/autofocus';
import { FocusTrapModule } from 'primeng/focustrap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    RouterModule,
    RippleModule,
    AppFloatingConfigurator,
    NgOptimizedImage,
    ReactiveFormsModule,
    NgxLoaderIndicatorDirective,
    ValidatorMessage,
    AutoFocusModule,
    FocusTrapModule
  ],
  templateUrl: './login.html'
})
export class Login {
  loading = false;

  form: FormGroup = new FormGroup({
    email: new FormControl('admin@admin.com', [Validators.required]),
    password: new FormControl('@zyba.@', [Validators.required]),
    remember: new FormControl(false, [Validators.required])
  });

  private readonly _router = inject(Router);
  private readonly _auth = inject(AuthService);
  private readonly _sessionService = inject(SessionService);
  private readonly _messageService = inject(MessageService);

  protected onSubmit(): void {
    this.form.markAsTouched();
    if (this.form.valid) {
      this.loading = true;
      this._auth.login(this.form.value).subscribe({
        next: (result) => {
          this._sessionService.createSession(result.token);
          this.loading = false;
          this._messageService.add({ severity: 'success', summary: 'Atenção', detail: 'Login efetuado com sucesso.', life: 3000 });
          void this._router.navigate(['/home']);
        },
        error: (error) => {
          this.loading = false;
          this._messageService.add({ severity: 'error', summary: 'Atenção', detail: 'Verifique suas credenciais e tente novamente.', life: 3000 });
          this.form.get('password')?.reset();
        }
      });
    } else {
      console.error('Invalid');
    }
  }
}
