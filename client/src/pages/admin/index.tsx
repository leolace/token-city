import { Outlet } from "react-router";
import { AdminHeader } from "./components/header";

export const AdminRoot = () => {
  return (
    <div className="min-h-screen">
      <AdminHeader />

      <div className="container mx-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};
