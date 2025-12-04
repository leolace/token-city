export interface OperatorLoginRequest {
  matricula: string;
  password: string;
}

export interface OperatorLoginResponse {
  cpf: string;
  nome: string;
  email: string;
  matricula: string;
  cargo: string;
  nivel: string;
  departamentos: string[];
}
