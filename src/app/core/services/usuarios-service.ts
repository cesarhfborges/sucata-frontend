import { Injectable } from '@angular/core';
import { HttpService } from '@/core/services/http-service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService extends HttpService {

  public checkEmailAvailability(email: string, id?: number): Observable<boolean> {
    console.log('Check email availability: ', email, id);
    return this._http
      .post<{ available: boolean }>(`${this.URL}/api/check-email`, {
        email,
        id: id || null
      })
      .pipe(map((res) => res.available));
  }

  public listar(): Observable<any[]> {
    return this._http.get<any[]>(`${this.URL}/api/usuarios`);
  }

  public get(id: number) {
    return this._http.get<any[]>(`${this.URL}/api/usuarios/${id}`);
  }
}
