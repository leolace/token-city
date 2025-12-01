import type { RouteObject } from "react-router";
import { AdminRoot } from ".";
import { DashboardPage } from "./pages/dashboard";
import { LoginPage } from "./pages/login";

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    Component: LoginPage,
  },
  {
    path: "/admin",
    Component: AdminRoot,
    children: [
      {
        path: "dashboard",
        Component: DashboardPage,
      },
    ],
  },
];
