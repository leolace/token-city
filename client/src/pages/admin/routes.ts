import type { RouteObject } from "react-router";
import { AdminRoot } from ".";
import { DashboardPage } from "./pages/dashboard";
import { LoginPage } from "./pages/login";
import { ReportsPage } from "./pages/reports";
import { ReportersPage } from "./pages/reporters";
import { DepartmentPage } from "./pages/department";

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
      {
        path: "denuncias",
        Component: ReportsPage,
      },
      {
        path: "denunciantes",
        Component: ReportersPage,
      },
      {
        path: "departamentos",
        Component: DepartmentPage,
      },
    ],
  },
];
