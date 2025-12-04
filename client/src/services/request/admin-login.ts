import { client } from "../client";
import { endpoints } from "../endpoints";
import type { AdminLoginRequest } from "../response/admin-login";

export const adminLogin = async (data: AdminLoginRequest) => {
  return client.post(endpoints.adminLogin, { json: data }).json();
};
