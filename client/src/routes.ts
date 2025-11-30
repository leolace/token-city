import { createBrowserRouter } from "react-router";
import { reporterRoutes } from "./pages/reporter/routes";
import { Root } from "./root";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [...reporterRoutes],
  },
]);
