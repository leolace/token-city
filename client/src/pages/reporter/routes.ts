import type { RouteObject } from "react-router";
import { Map } from "./pages/map";

export const reporterRoutes: RouteObject[] = [
  {
    path: "/",
    Component: Map,
  },
];
