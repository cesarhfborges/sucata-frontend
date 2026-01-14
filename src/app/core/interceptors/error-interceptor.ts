import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AuthService } from '@/core/services/auth-service';
import { SessionService } from '@/core/services/session-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const sessionService = inject(SessionService);
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((e: HttpErrorResponse) => {

      if (sessionService.hasActiveSession() && e.status === 401) {
        messageService.add({
          severity: 'error',
          summary: 'Atenção',
          detail: 'Ops, não foi possível concluir a solicitação tente novamente mais tarde.',
          life: 3000
        });

        authService.logout();
      }

      if (e.error.message) {
        messageService.add({
          severity: 'error',
          summary: 'Atenção',
          detail: e.error.message,
          life: 3000
        });
      }

      if (e.error.messages) {
        const errors: string[] = Object.values(e.error.messages);
        console.info(errors);
        messageService.add({
          severity: 'error',
          summary: 'Atenção',
          detail: errors[0],
          life: 3000
        });
      }
      return throwError(() => e);
    })
  );
};
