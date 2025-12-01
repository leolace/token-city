import { Card, CardContent } from "@app/components/primitives/card";
import { cn } from "@app/lib/utils";
import { NavLink } from "react-router";

const navItems = [
  { label: "Denúncias", path: "/admin/denuncias" },
  { label: "Recompensas", path: "/admin/recompensas" },
  { label: "Categorias", path: "/admin/categorias" },
  { label: "Departamentos", path: "/admin/departamentos" },
];

export const AdminHeader = () => {
  return (
    <Card className="rounded-none border-x-0 border-t-0 bg-sidebar-primary text-sidebar-primary-foreground">
      <CardContent className="p-6 grid justify-items-center gap-4">
        <h1 className="text-2xl font-bold">Token City - Admin</h1>
        <nav className="flex gap-4 flex-wrap">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
};
