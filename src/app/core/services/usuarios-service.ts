import { Injectable } from '@angular/core';
import { HttpService } from '@/core/services/http-service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService extends HttpService {
  public listar(): Observable<any[]> {
    return this._http.get<any[]>(`${this.URL}/api/usuarios`);
  }

  public checkEmail(email: string): Observable<boolean> {
    return this._http.post<{ available: boolean }>(`${this.URL}/api/email-check`, { email }).pipe(map((res) => res.available));
  }
}
