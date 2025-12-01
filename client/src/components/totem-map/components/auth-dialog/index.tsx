import { Button } from "@app/components/primitives/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@app/components/primitives/dialog";
import { Input } from "@app/components/primitives/input";
import type { ReactNode } from "react";
import { useMap } from "react-map-gl/maplibre";
import { useNavigate } from "react-router";

interface Props {
  children: ReactNode;
}

export const AuthDialog = ({ children }: Props) => {
  const navigate = useNavigate();
  const { totemMap } = useMap();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de autenticação pode ser adicionada aqui
    navigate("/report", { state: totemMap?.getBearing() });
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>

      <DialogContent className="min-w-160 min-h-80">
        <DialogHeader>
          <DialogTitle>Insira seus dados</DialogTitle>
        </DialogHeader>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <Input placeholder="Digite seu CPF" type="text" />
          <Input placeholder="Digite sua senha" type="password" />

          <div className="flex gap-3 justify-between">
            <DialogClose>
              <Button type="button" variant="ghost" size="xl">
                Cancelar
              </Button>
            </DialogClose>
            <Button className="flex-1" type="submit" size="xl">
              Enviar denúncia
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
