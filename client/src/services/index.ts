import type { Reporter } from "@app/types/user";
import { client } from "./client";
import { endpoints } from "./endpoints";
import type {
  CreateReportRequest,
  LoginRequest,
  ReporterProfileRequest,
} from "./request";
import type {
  CountResponse,
  Report,
  RepoerterProfileResponse,
} from "./response";

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
    all: async () => {
      const data = await client.get(endpoints.report.all).json<Report[]>();
      return data;
    },
    countResolved: async () => {
      const data = await client
        .get(endpoints.report.countResolved)
        .json<CountResponse>();
      return data;
    },
    countPending: async () => {
      const data = await client
        .get(endpoints.report.countPending)
        .json<CountResponse>();
      return data;
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

  reward: {
    countRedeemed: async () => {
      const data = await client
        .get(endpoints.reward.countRedeemed)
        .json<CountResponse>();
      return data;
    },
  },
};
