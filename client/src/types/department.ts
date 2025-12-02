export interface Department {
  siglaDepartamento: string;
  statusAtual: string;
  totalDenuncias: string;
}

export interface DepartmentsResponse {
  departamentos: Department[];
}

export interface DepartmentFullService {
  nome: string;
  sigla: string;
}

export interface DepartmentsFullServiceResponse {
  departamentos: DepartmentFullService[];
}
