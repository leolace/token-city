export interface HistoricoStatus {
  status: string;
  data_historico: string;
}

export interface GetReportResponse {
  usuario: string;
  totem: string;
  data: string;
  coordenadas: string;
  descricao: string;
  valida: string;
  prioridade: string;
  sigla: string;
  status: string;
  data_historico: string;
  nome_usuario: string;
  email_usuario: string;
  cidade_totem: string;
  estado_totem: string;
  nome_departamento: string;
  historico: HistoricoStatus[];
}
