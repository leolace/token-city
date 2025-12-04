export interface AdminLoginRequest {
  matricula: string;
  password: string;
}

export interface AdminLoginResponse {
  cpf: string;
  nome: string;
  email: string;
  matricula: string;
  cargo: string;
  nivel: string;
}
