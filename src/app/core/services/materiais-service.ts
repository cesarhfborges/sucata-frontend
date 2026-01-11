import { Injectable } from '@angular/core';
import { HttpService } from '@/core/services/http-service';
import { Observable } from 'rxjs';
import { Material } from '@/core/models/material';

@Injectable({
  providedIn: 'root'
})
export class MateriaisService extends HttpService {

  listar(): Observable<Material[]> {
    return this._http.get<Material[]>(`${this.URL}/api/materiais`);
  }


  get(codigo: string): Observable<Material> {
    return this._http.get<Material>(`${this.URL}/api/materiais/${codigo}`);
  }

  cadastrar(payload: Material): Observable<Material> {
    return this._http.post<Material>(`${this.URL}/api/materiais`, payload);
  }

  atualizar(codigo: string, payload: Material): Observable<Material> {
    return this._http.put<Material>(`${this.URL}/api/materiais/${codigo}`, payload);
  }

  delete(codigo: string): Observable<any> {
    return this._http.delete<any>(`${this.URL}/api/materiais/${codigo}`);
  }
}
