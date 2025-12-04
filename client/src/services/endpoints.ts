const BASE_URL = import.meta.env.REACT_APP_CORE_API_URL;

export const endpoints = {
  user: {
    login: `${BASE_URL}/user/login`,
  },
  operatorLogin: `${BASE_URL}/user/login/operador`,
  report: {
    get: (userId: string, data: string, coordenadas: string) =>
      `${BASE_URL}/denuncia/${userId}/${data}/${coordenadas}`,
    create: `${BASE_URL}/denuncia`,
    all: `${BASE_URL}/denuncia/all`,
    byDepartment: (sigla: string) => `${BASE_URL}/denuncia/departamento/${sigla}`,
    byDepartments: `${BASE_URL}/denuncia/departamentos`,
    countResolved: `${BASE_URL}/denuncia/count/resolvidas`,
    countPending: `${BASE_URL}/denuncia/count/pendentes`,
    pending: `${BASE_URL}/denuncia/pendentes`,
    mostRecent: (state: string, city: string) =>
      `${BASE_URL}/denuncia/mais-recentes/${state}/${city}`,
    updateStatus: `${BASE_URL}/denuncia/status`,
  },
  reporter: {
    profile: (cpf: string) => `${BASE_URL}/denunciante/profile/${cpf}`,
    top: `${BASE_URL}/denunciante/top`,
  },
  reward: {
    countRedeemed: `${BASE_URL}/recompensa/count/resgates`,
  },
  totem: {
    endpoint: `${BASE_URL}/totem`,
    all: `${BASE_URL}/totem`,
    delete: (numero_serie: string) => `${BASE_URL}/totem/${numero_serie}`,
  },
  department: {
    byStatus: `${BASE_URL}/denuncia/metricas/por-departamento-status`,
    acceptAllCategories: `${BASE_URL}/departamentos/atende-todas-denuncias`,
    categoriesByTotem: (totemId: string) => `${BASE_URL}/departamentos/categorias/totem/${totemId}`,
  },
};
