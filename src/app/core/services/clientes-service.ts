import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@/core/services/http-service';
import { Cliente } from '@/core/models/cliente';
import { Paginated } from '@/core/interfaces/paginated';
import { HttpParams } from '@angular/common/http';

interface UrlParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
  filter?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService extends HttpService {
  public listar(params?: UrlParams): Observable<Paginated<Cliente>> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    console.log('listar params: ', httpParams);
    return this._http.get<Paginated<Cliente>>(`${this.URL}/api/clientes`, { params: httpParams });
  }

  public get(id: number): Observable<any> {
    return this._http.get<any>(`${this.URL}/api/clientes/${id}`);
  }

  public atualizar(id: number, data: any): Observable<any> {
    return this._http.put<any>(`${this.URL}/api/clientes/${id}`, data);
  }

  public cadastrar(data: any): Observable<any> {
    return this._http.post<any>(`${this.URL}/api/clientes`, data);
  }

  public delete(id: number): Observable<any> {
    return this._http.delete<any>(`${this.URL}/api/clientes/${id}`);
  }
}
