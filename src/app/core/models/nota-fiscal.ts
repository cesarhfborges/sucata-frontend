export interface NotaFiscal {
  id?: number;
  empresa_id: number;
  cliente_id: number;
  nota_fiscal: number;
  serie: number;
  emissao: Date;
  pendente?: boolean;
  created_at: Date;
  updated_at: Date;
}
