import { Card, CardContent } from "@app/components/primitives/card";
import { cn } from "@app/lib/utils";
import { Link, NavLink } from "react-router";
import {
  AlertCircle,
  Users,
  Monitor,
  Gift,
  Building2,
  LayoutDashboard,
} from "lucide-react";

const navItems = [
  { label: "Denúncias", path: "/admin/denuncias", icon: AlertCircle },
  { label: "Denunciantes", path: "/admin/denunciantes", icon: Users },
  { label: "Totems", path: "/admin/totem", icon: Monitor },
  { label: "Recompensas", path: "/admin/recompensas", icon: Gift },
  { label: "Departamentos", path: "/admin/departamentos", icon: Building2 },
];

export const AdminHeader = () => {
  return (
    <Card className="rounded-none border-x-0 border-t-0 bg-linear-to-r from-sidebar-primary via-sidebar-primary to-sidebar-primary/95 text-sidebar-primary-foreground shadow-lg">
      <CardContent className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-6 py-2">
          {/* Logo/Title */}
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
          >
            <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
              <LayoutDashboard className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Token City</h1>
              <p className="text-xs text-sidebar-primary-foreground/70">
                Painel Administrativo
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex gap-4 flex-wrap items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-105",
                    )
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </CardContent>
    </Card>
  );
};
