import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { SessionService } from '@/core/services/session-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService = inject(SessionService);
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((e: HttpErrorResponse) => {
      if (sessionService.hasActiveSession() && e.status === 401) {
        messageService.add({
          severity: 'error',
          summary: 'Atenção',
          detail: 'Você não esta autenticado no momento.',
          life: 3000
        });

        sessionService.clearSession();
        return next(req);
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
