import { UF } from '@/core/enums/uf';
import { Usuario } from '@/core/models/usuario';

export interface Cliente {
  id?: number;
  nome_razaosocial: string;
  sobrenome_nomefantasia: string;
  cpf_cnpj: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: UF;
  telefone: string;
  email: string;
  observacoes: string;

  created_at?: Date;
  updated_at?: Date;

  criado_por?: Usuario;
  atualizado_por?: Usuario;
}
