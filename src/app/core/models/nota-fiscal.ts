export interface NotaFiscal {
  id?: number;
  empresa_id: number;
  cliente_id: number;
  nota_fiscal: number;
  serie: number;
  emissao: Date;
  status: 'PENDENTE' | 'DEVOLVIDA';
  created_at: Date;
  updated_at: Date;
}
