import type { Reporter } from "@app/types/user";
import { client } from "./client";
import { endpoints } from "./endpoints";
import type {
  CreateReportRequest,
  LoginRequest,
  ReporterProfileRequest,
} from "./request";
import type { RepoerterProfileResponse } from "./response";

export const coreService = {
  login: async (json: LoginRequest) => {
    const data = await client
      .post(endpoints.user.login, { json })
      .json<Reporter>();

    return data;
  },

  report: {
    create: async (json: CreateReportRequest) => {
      await client.post(endpoints.report.create, { json });
    },
  },

  reporter: {
    profile: async ({ cpf }: ReporterProfileRequest) => {
      const data = await client
        .get(endpoints.reporter.profile(cpf))
        .json<RepoerterProfileResponse>();

      return data;
    },
  },
};
