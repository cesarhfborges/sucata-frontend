import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SessionService } from '@/core/services/session-service';
import { MessageService } from 'primeng/api';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const sessionService = inject(SessionService);
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

        sessionService.clearSession();

        void router.navigate(['/login']);
      } else {
        if (error.error.message) {
          messageService.add({
            severity: 'error',
            summary: 'Atenção',
            detail: error.error.message,
            life: 3000
          });
        }
      }

      return throwError(() => error);
    })
  );
};
