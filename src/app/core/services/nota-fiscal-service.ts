import { Injectable } from '@angular/core';
import { HttpService } from '@/core/services/http-service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { NotaFiscal } from '@/core/models/nota-fiscal';

@Injectable({
  providedIn: 'root'
})
export class NotaFiscalService extends HttpService {
  public listar(params?: any): Observable<NotaFiscal[]> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          return;
        }

        if (Array.isArray(value)) {
          httpParams = httpParams.set(key, value.join(','));
        } else {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this._http.get<NotaFiscal[]>(`${this.URL}/api/notas-fiscais`, { params: httpParams });
  }
}
