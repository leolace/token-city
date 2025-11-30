import type { ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../primitives/dialog";
import { Input } from "../primitives/input";
import { Button } from "../primitives/button";

interface Props {
  children: ReactNode;
}

export const ReportDialog = ({ children }: Props) => {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insira seus dados</DialogTitle>
        </DialogHeader>
        <form className="grid gap-5">
          <Input placeholder="Seu e-mail" type="email" />
          <Input placeholder="Sua senha" type="password" />

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
