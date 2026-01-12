import { Injectable } from '@angular/core';
import { HttpService } from '@/core/services/http-service';
import { Observable } from 'rxjs';
import { Material } from '@/core/models/material';
import { Paginated } from '@/core/interfaces/paginated';
import { UrlParams } from '@/core/interfaces/url-params';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MateriaisService extends HttpService {
  listar(params?: UrlParams): Observable<Paginated<Material>> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    return this._http.get<Paginated<Material>>(`${this.URL}/api/materiais`, { params: httpParams });
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
