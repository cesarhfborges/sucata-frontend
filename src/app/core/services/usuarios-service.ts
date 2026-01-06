import { Injectable } from '@angular/core';
import { HttpService } from '@/core/services/http-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService extends HttpService {
  public listar(): Observable<any[]> {
    return this._http.get<any[]>(`${this.URL}/api/usuarios`);
  }
}
