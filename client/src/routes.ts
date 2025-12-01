import { createBrowserRouter } from "react-router";
import { reporterRoutes } from "./pages/reporter/routes";
import { Root } from "./root";
import { adminRoutes } from "./pages/admin/routes";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [...reporterRoutes, ...adminRoutes],
  },
]);
