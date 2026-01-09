import { UF } from '@/core/enums/uf';

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
  updated_at?: Date;
  created_at?: Date;
}
