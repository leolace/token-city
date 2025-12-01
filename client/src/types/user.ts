interface User {
  cpf: string;
  nome: string;
  email: string;
  senha: string;
}

export interface Reporter extends User {
  Saldo_Tokens: string;
  Status: string;
}
