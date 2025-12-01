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
  },
  reporter: {
    profile: (cpf: string) => `${BASE_URL}/denunciante/profile/${cpf}`,
  },
  reward: {
    countRedeemed: `${BASE_URL}/recompensa/count/resgates`,
  },
};
