import { Injectable } from '@angular/core';
import { HttpService } from '@/core/services/http-service';
import { Observable } from 'rxjs';
import { Empresa } from '@/core/models/empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService extends HttpService {
  public listar(): Observable<Empresa[]> {
    return this._http.get<Empresa[]>(`${this.URL}/api/empresas`);
  }

  public get(id: number): Observable<Empresa> {
    return this._http.get<Empresa>(`${this.URL}/api/empresas/${id}`);
  }

  public atualizar(id: number, data: Empresa): Observable<Empresa> {
    return this._http.put<Empresa>(`${this.URL}/api/empresas/${id}`, data);
  }

  public cadastrar(data: Empresa): Observable<Empresa> {
    return this._http.post<Empresa>(`${this.URL}/api/empresas`, data);
  }

  public update(id: number, data: Empresa): Observable<Empresa> {
    return this._http.put<Empresa>(`${this.URL}/api/empresas/${id}`, data);
  }
}
