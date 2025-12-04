export const ReportCategory = {
  Iluminacao: "Iluminação",
  Buraco: "Buraco",
  Lixo: "Lixo",
  Calcada: "Calçada",
  Sinalizacao: "Sinalização",
} as const;

export type ReportCategory =
  (typeof ReportCategory)[keyof typeof ReportCategory];

export interface Report {
  categoria: ReportCategory;
  nomeUsuario: string;
  data: string;
  coordenadas: string;
  descricao: string;
  prioridade: number;
  status: string;
  cpf: string;
}
