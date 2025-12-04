import { useNavigate } from "react-router";
import { Button } from "@app/components/primitives/button";

export const OperatorHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/operador");
  };

  return (
    <header className="bg-sidebar border-b border-sidebar-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-sidebar-foreground">
          Painel do Operador
        </h1>

        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};
