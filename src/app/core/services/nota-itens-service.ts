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

  get(notaFiscalId: number, itemId: number): Observable<ItemNota> {
    return this._http.get<ItemNota>(`${this.URL}/api/notas-fiscais/${notaFiscalId}/itens/${itemId}`);
  }

  cadastrar(notaFiscalId: number, payload: Partial<ItemNota>): Observable<ItemNota> {
    return this._http.post<ItemNota>(`${this.URL}/api/notas-fiscais/${notaFiscalId}/itens`, payload);
  }

  atualizar(notaFiscalId: number, itemId: number, payload: Partial<ItemNota>): Observable<ItemNota> {
    return this._http.put<ItemNota>(`${this.URL}/api/notas-fiscais/${notaFiscalId}/itens/${itemId}`, payload);
  }

  delete(notaFiscalId: number, itemId: number): Observable<any> {
    return this._http.delete<any>(`${this.URL}/api/notas-fiscais/${notaFiscalId}/itens/${itemId}`);
  }

  movimentar(notaFiscalId: number, itemId: number, data: any): Observable<any> {
    return this._http.post<any>(`${this.URL}/api/notas-fiscais/${notaFiscalId}/itens/${itemId}/movimentar`, data);
  }
}
