import { Outlet } from "react-router";
import { OperatorHeader } from "./components/header";

export const OperatorRoot = () => {
  return (
    <div className="min-h-screen">
      <OperatorHeader />

      <div className="container mx-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};
