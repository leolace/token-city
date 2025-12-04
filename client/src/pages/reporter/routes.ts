import type { RouteObject } from "react-router";
import { Map } from "./pages/map";
import { ReportPage } from "./pages/report";
import { SuccessPage } from "./pages/success";
import { RewardsPage } from "./pages/rewards";

export const reporterRoutes: RouteObject[] = [
  {
    path: "/",
    Component: Map,
  },
  {
    path: "/report",
    Component: ReportPage,
  },
  {
    path: "/report/success",
    Component: SuccessPage,
  },
  {
    path: "/reporter/rewards",
    Component: RewardsPage,
  },
];
