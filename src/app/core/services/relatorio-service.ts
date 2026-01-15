import { Injectable } from '@angular/core';
import { HttpService } from '@/core/services/http-service';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService extends HttpService {
  gerar(dados: any) {
    return this._http.post(`${this.URL}/api/relatorios/por-cliente`, dados, {
      responseType: 'blob',
      withCredentials: true
    });
  }
}
