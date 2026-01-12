import { Injectable } from '@angular/core';
import { HttpService } from '@/core/services/http-service';
import { Observable } from 'rxjs';

export interface EstatisticasResumo {
  notas_pendentes: number;
  itens_pendentes: number;
  saldo_devedor_total: number;
  faturado_mes: number;
}

export interface EstatisticasStatusGeral {
  total_notas: number;
  pendentes: number;
  quitadas: number;
  percentual_pendente: number;
}

export interface MaterialMaiorDebito {
  material_id: string;
  debito_total: number;
}

export interface ClienteMaiorPendencia {
  id: number;
  nome_razaosocial: string;
  saldo_devedor: number;
}

export interface UltimaMovimentacao {
  id: number;
  material_id: string;
  faturado: number;
  saldo_devedor: number;
  updated_at: string;
}

export interface GraficoXY {
  labels: string[];
  values: number[];
}

@Injectable({
  providedIn: 'root'
})
export class EstatisticasService extends HttpService {
  resumo(): Observable<EstatisticasResumo> {
    return this._http.get<EstatisticasResumo>(`${this.URL}/api/estatisticas/resumo`);
  }

  /**
   * LINHA 3 — Status geral do sistema
   */
  statusGeral(): Observable<EstatisticasStatusGeral> {
    return this._http.get<EstatisticasStatusGeral>(`${this.URL}/api/estatisticas/status-geral`);
  }

  /**
   * LINHA 3 — Materiais com MAIOR DÉBITO
   * (⚠️ não é saldo devedor)
   */
  materiaisComMaiorDebito(): Observable<MaterialMaiorDebito[]> {
    return this._http.get<MaterialMaiorDebito[]>(`${this.URL}/api/estatisticas/materiais-maior-debito`);
  }

  /**
   * LINHA 4 — Clientes com maior pendência
   */
  clientesComMaiorPendencia(): Observable<GraficoXY> {
    return this._http.get<GraficoXY>(`${this.URL}/api/estatisticas/clientes-maior-pendencia`);
  }

  /**
   * LINHA 5 — Últimas movimentações
   */
  ultimasMovimentacoes(): Observable<UltimaMovimentacao[]> {
    return this._http.get<UltimaMovimentacao[]>(`${this.URL}/api/estatisticas/ultimas-movimentacoes`);
  }

  notasPendentesPorFaixa(): Observable<GraficoXY> {
    return this._http.get<GraficoXY>(`${this.URL}/api/estatisticas/pendencias-por-faixa`);
  }
}
