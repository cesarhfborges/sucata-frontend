import { Injectable } from '@angular/core';
import { HttpService } from '@/core/services/http-service';
import { Observable } from 'rxjs';
import { ItemNota } from '@/core/models/item-nota';

@Injectable({
  providedIn: 'root'
})
export class NotaItensService extends HttpService {
  listar(nota_fiscal_id: number): Observable<ItemNota[]> {
    return this._http.get<ItemNota[]>(`${this.URL}/api/notas-fiscais/${nota_fiscal_id}/itens`);
  }
}
