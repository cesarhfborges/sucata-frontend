import { Material } from '@/core/models/material';
import { Usuario } from '@/core/models/usuario';

export interface ItemNota {
  id?: number;
  nota_fiscal_id: number;
  material_id: string;
  faturado: number;
  saldo_devedor: number;
  pendente?: boolean;

  material: Material;

  created_at?: Date;
  updated_at?: Date;

  criado_por?: Usuario;
  atualizado_por?: Usuario;
}
