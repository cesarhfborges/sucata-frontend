import { Usuario } from '@/core/models/usuario';

export interface Material {
  codigo: string;
  descricao: string;
  un: string;

  created_at?: Date;
  updated_at?: Date;

  criado_por?: Usuario;
  atualizado_por?: Usuario;
}
