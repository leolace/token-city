export interface User {
  cpf: string;
  nome: string;
  email: string;
  senha: string;
}

export interface Reporter extends User {
  saldo_tokens: number;
  status: string;
}
