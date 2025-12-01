import type { Reporter } from "@app/types/user";
import { client } from "./client";
import { endpoints } from "./endpoints";
import type { CreateReportRequest, LoginRequest } from "./request";

export const coreService = {
  login: async (json: LoginRequest) => {
    const data = await client
      .post(endpoints.user.login, { json })
      .json<Reporter>();

    return data;
  },

  report: {
    create: async (json: CreateReportRequest) => {
      await client.post(endpoints.report.create, { json }).json<void>();
    },
  },
};
