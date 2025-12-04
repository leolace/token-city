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
import { useForm } from "@tanstack/react-form";
import { Spinner } from "@app/components/primitives/spinner";
import { useReporterLoginMutation } from "./hooks";

interface Props {
  children: ReactNode;
}

const defaultValues = {
  email: "ana@email.com",
  password: "senha123",
};

export const AuthDialog = ({ children }: Props) => {
  const { loginReporter, isReporterLoginLoading, loginError, isLoginError, resetError } = useReporterLoginMutation();

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      loginReporter({
        email: value.email,
        password: value.password,
      });
    },
    validators: {
      onChange: ({ value }) => {
        if (isLoginError) resetError();
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

          {isLoginError && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md text-sm">
              {loginError?.message || "Credenciais inv\u00e1lidas"}
            </div>
          )}

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
                  disabled={isReporterLoginLoading || !state.canSubmit}
                >
                  {isReporterLoginLoading ? <Spinner /> : "Avançar"}
                </Button>
              )}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
