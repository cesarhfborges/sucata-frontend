import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AuthService } from '@/core/services/auth-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('Sessão expirada ou inválida. Redirecionando...');

        messageService.add({
          severity: 'error',
          summary: 'Atenção',
          detail: 'Ops, não foi possível concluir a solicitação tente novamente mais tarde.',
          life: 3000
        });

        authService.logout();
      }

      if (error.error.message) {
        messageService.add({
          severity: 'error',
          summary: 'Atenção',
          detail: error.error.message,
          life: 3000
        });
      }
      return throwError(() => error);
    })
  );
};
