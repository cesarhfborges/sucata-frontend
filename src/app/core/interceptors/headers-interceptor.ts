import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from '@/core/services/session-service';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService = inject(SessionService);
  
  const isBlobRequest = req.responseType === 'blob' || req.responseType === 'arraybuffer';

  const headers: { [name: string]: string } = {};

  if (!isBlobRequest) {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json';
  }

  if (sessionService.hasActiveSession()) {
    headers['Authorization'] = `Bearer ${sessionService.token()}`;
  }

  const authReq = req.clone({
    setHeaders: headers,
    withCredentials: true
  });

  return next(authReq);
};
