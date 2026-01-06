import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from '@/core/services/session-service';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService = inject(SessionService);

  const headers: { [name: string]: string } = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };

  if (sessionService.hasActiveSession()) {
    headers['Authorization'] = `Bearer ${sessionService.token()}`;
  }

  const authReq = req.clone({
    // setHeaders: {
    //   'Content-Type': 'application/json',
    //   'Accept': 'application/json',
    // }
    setHeaders: headers
  });

  return next(authReq);
};
