import type { Reporter } from "@app/types/user";
import { client } from "./client";
import { endpoints } from "./endpoints";
import type {
  CreateReportRequest,
  CreateRewardRequest,
  CreateTotemRequest,
  DeleteTotemRequest,
  GetPendingReportsRequest,
  GetReportRequest,
  LoginRequest,
  ReporterProfileRequest,
} from "./request";
import type {
  CountResponse,
  RepoerterProfileResponse,
  GetPendingReportsResponse,
  GetAllTotemsResponse,
  GetReportResponse,
  GetAllRewardsResponse,
  GetUserRewardsResponse,
  RedeemRewardResponse,
} from "./response";
import type { GetMostRecentsReportsRequest } from "./request/get-most-recents-reports";
import type { GetTopReporterResponse } from "./response/get-top-reporter";
import type {
  DepartmentsResponse,
  DepartmentsFullServiceResponse,
} from "@app/types/department";

export const coreService = {
  login: async (json: LoginRequest) => {
    const data = await client
      .post(endpoints.user.login, { json })
      .json<Reporter>();

    return data;
  },

  report: {
    get: async ({ userId, date, coordenadas }: GetReportRequest) => {
      const data = await client
        .get(endpoints.report.get(userId, date, coordenadas))
        .json<GetReportResponse>();
      return data;
    },
    create: async (json: CreateReportRequest) => {
      await client.post(endpoints.report.create, { json });
    },
    all: async () => {
      const data = await client.get(endpoints.report.all).json<Report[]>();
      return data;
    },
    byDepartment: async (sigla: string) => {
      const data = await client
        .get(endpoints.report.byDepartment(sigla))
        .json<Report[]>();
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
    getPending: async (req: GetPendingReportsRequest) => {
      const data = await client
        .post(endpoints.report.pending, { json: req })
        .json<GetPendingReportsResponse>();

      return data;
    },
    getMostRecent: async (req: GetMostRecentsReportsRequest) => {
      const data = await client
        .get(endpoints.report.mostRecent(req.state, req.city))
        .json<GetPendingReportsResponse>();

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
    top: async () => {
      const data = await client
        .get(endpoints.reporter.top)
        .json<GetTopReporterResponse>();

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
    listAll: async () => {
      const data = await client
        .get(endpoints.reward.endpoint)
        .json<GetAllRewardsResponse>();
      return data;
    },
    create: async (req: CreateRewardRequest) => {
      await client.post(endpoints.reward.endpoint, { json: req });
    },
    getByUser: async (cpf: string) => {
      const data = await client
        .get(endpoints.reward.byUser(cpf))
        .json<GetUserRewardsResponse>();
      return data;
    },
    redeem: async (req: { userId: string; rewardId: string }) => {
      const data = await client
        .post(`${endpoints.reward.endpoint}/${req.rewardId}`, {
          json: { userId: req.userId },
        })
        .json<RedeemRewardResponse>();
      return data;
    },
  },

  totem: {
    all: async () => {
      const data = await client
        .get(endpoints.totem.all)
        .json<GetAllTotemsResponse>();
      return data;
    },
    create: async (req: CreateTotemRequest) => {
      await client.post(endpoints.totem.endpoint, { json: req });
    },
    delete: async (req: DeleteTotemRequest) => {
      await client.delete(endpoints.totem.delete(req.numero_serie));
    },
  },

  department: {
    byStatus: async () => {
      const data = await client
        .get(endpoints.department.byStatus)
        .json<DepartmentsResponse>();
      return data;
    },
    fullService: async () => {
      const data = await client
        .get(endpoints.department.acceptAllCategories)
        .json<DepartmentsFullServiceResponse>();
      return data;
    },
  },
};
