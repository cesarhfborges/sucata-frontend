import { Material } from '@/core/models/material';

export interface ItemNota {
  id: number;
  nota_fiscal_id: number;
  material_id: string;
  faturado: number;
  saldo_devedor: number;
  pendente?: boolean;

  material: Material;

  created_at?: Date;
  updated_at?: Date;
}
