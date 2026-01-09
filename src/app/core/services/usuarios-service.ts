import { Injectable } from '@angular/core';
import { HttpService } from '@/core/services/http-service';
import { map, Observable } from 'rxjs';
import { Usuario } from '@/core/models/usuario';

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

  public listar(): Observable<Usuario[]> {
    return this._http.get<Usuario[]>(`${this.URL}/api/usuarios`);
  }

  public get(id: number): Observable<Usuario> {
    return this._http.get<Usuario>(`${this.URL}/api/usuarios/${id}`);
  }

  public cadastrar(data: any) {
    return this._http.post<Usuario>(`${this.URL}/api/usuarios`, data);
  }

  public atualizar(id: number, data: any) {
    return this._http.put<Usuario>(`${this.URL}/api/usuarios/${id}`, data);
  }
}
