export interface Usuario {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  ativo: boolean;
  avatar?: string;
  ult_acesso: Date | null;
  created_at: Date;
  updated_at: Date;
}
