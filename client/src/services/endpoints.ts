const BASE_URL = import.meta.env.REACT_APP_CORE_API_URL;

export const endpoints = {
  user: {
    login: `${BASE_URL}/user/login`,
  },
  report: {
    create: `${BASE_URL}/denuncia`,
  },
};
