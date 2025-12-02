const BASE_URL = import.meta.env.REACT_APP_CORE_API_URL;

export const endpoints = {
  user: {
    login: `${BASE_URL}/user/login`,
  },
  report: {
    create: `${BASE_URL}/denuncia`,
    all: `${BASE_URL}/denuncia/all`,
    countResolved: `${BASE_URL}/denuncia/count/resolvidas`,
    countPending: `${BASE_URL}/denuncia/count/pendentes`,
    pending: `${BASE_URL}/denuncia/pendentes`,
    mostRecent: (state: string, city: string) =>
      `${BASE_URL}/denuncia/mais-recentes/${state}/${city}`,
  },
  reporter: {
    profile: (cpf: string) => `${BASE_URL}/denunciante/profile/${cpf}`,
    top: `${BASE_URL}/denunciante/top`,
  },
  reward: {
    countRedeemed: `${BASE_URL}/recompensa/count/resgates`,
  },
  totem: {
    all: `${BASE_URL}/totem`,
  },
  department: {
    byStatus: `${BASE_URL}/denuncia/metricas/por-departamento-status`,
    acceptAllCategories: `${BASE_URL}/departamentos/atende-todas-denuncias`,
  },
};
