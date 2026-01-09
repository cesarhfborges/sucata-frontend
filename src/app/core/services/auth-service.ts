import { inject, Injectable } from '@angular/core';
import { HttpService } from '@/core/services/http-service';
import { Observable, switchMap, tap } from 'rxjs';
import { Usuario } from '@/core/models/usuario';
import { SessionService } from '@/core/services/session-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends HttpService {
  private readonly _sessionService = inject(SessionService);

  public login(data: { email: string; password: string; remember?: boolean }): Observable<any> {
    return this._http.post<any>(`${this.URL}/api/login`, data).pipe(
      switchMap((value) => {
        this._sessionService.createSession(value.token);
        return this.getPerfil();
      })
    );
  }

  public getPerfil(): Observable<Usuario> {
    return this._http.get<Usuario>(`${this.URL}/api/perfil`).pipe(
      tap((value) => {
        console.log('perfil: ', value);
        this._sessionService.updatePerfil(value);
      })
    );
  }

  public updatePerfil(data: any): Observable<Usuario> {
    return this._http.put<Usuario>(`${this.URL}/api/perfil`, data).pipe(
      tap((value) => {
        this._sessionService.updatePerfil(value);
      })
    );
  }

  public logout(): void {
    this._sessionService.clearSession();
    queueMicrotask(() => {
      window.location.href = '/login';
    });
  }
}
