import { Usuario } from '@/core/models/usuario';

export interface Empresa {
  id?: number;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  telefone: string;
  email: string;
  observacoes: string;

  created_at?: Date;
  updated_at?: Date;

  criado_por?: Usuario;
  atualizado_por?: Usuario;
}
