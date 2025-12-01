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
import { useLoginMutation } from "./hooks";
import { useForm } from "@tanstack/react-form";
import { Spinner } from "@app/components/primitives/spinner";

interface Props {
  children: ReactNode;
}

const defaultValues = {
  email: "ana@email.com",
  password: "senha123",
};

export const AuthDialog = ({ children }: Props) => {
  const navigate = useNavigate();
  const { totemMap } = useMap();
  const { login, isLoginLoading } = useLoginMutation();
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await login(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: (data) => {
            console.log(data);
            navigate("/report", { state: totemMap?.getBearing() });
          },
        }
      );
    },
    validators: {
      onChange: ({ value }) => {
        console.log(value);
        if (value.email.length === 0 || value.password.length === 0)
          return "Preencha todos os campos";
        return undefined;
      },
    },
  });

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>

      <DialogContent className="min-w-160 min-h-80">
        <DialogHeader>
          <DialogTitle>Insira seus dados</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="email"
            children={(field) => (
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Digite seu e-mail"
                type="email"
              />
            )}
          />

          <form.Field
            name="password"
            children={(field) => (
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Digite sua senha"
                type="password"
              />
            )}
          />

          <div className="flex gap-3 justify-between">
            <DialogClose>
              <Button type="button" variant="ghost" size="xl">
                Cancelar
              </Button>
            </DialogClose>
            <form.Subscribe
              children={(state) => (
                <Button
                  className="flex-1"
                  type="submit"
                  size="xl"
                  disabled={isLoginLoading || !state.canSubmit}
                >
                  {isLoginLoading ? <Spinner /> : "Avançar"}
                </Button>
              )}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
