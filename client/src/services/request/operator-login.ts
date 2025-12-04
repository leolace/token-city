import { client } from "../client";
import { endpoints } from "../endpoints";
import type { OperatorLoginRequest } from "../response/operator-login";

export const operatorLogin = async (data: OperatorLoginRequest) => {
  return client.post(endpoints.operatorLogin, { json: data }).json();
};
