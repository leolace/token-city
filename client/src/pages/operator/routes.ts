import type { RouteObject } from "react-router";
import { OperatorRoot } from ".";
import { LoginPage } from "./pages/login";
import { ReportsPage } from "./pages/reports";

export const operatorRoutes: RouteObject[] = [
  {
    path: "/operador",
    Component: LoginPage,
  },
  {
    path: "/operador",
    Component: OperatorRoot,
    children: [
      {
        path: "denuncias",
        Component: ReportsPage,
      },
    ],
  },
];
