import { Button } from "@app/components/primitives/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@app/components/primitives/card";
import { Input } from "@app/components/primitives/input";
import { Label } from "@app/components/primitives/label";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router";

interface LoginForm {
  matricula: string;
  senha: string;
}

const defaultValues: LoginForm = {
  matricula: "",
  senha: "",
};

export const LoginPage = () => {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      console.log(value);
      // TODO: Implementar autenticação
      navigate("/admin/dashboard");
    },
  });

  return (
    <div className="min-h-screen bg-sidebar-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-sidebar text-sidebar-foreground border-sidebar-border">
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            Token City - Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field
              name="matricula"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor="matricula">Matrícula</Label>
                  <Input
                    id="matricula"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Digite sua matrícula"
                  />
                </div>
              )}
            />

            <form.Field
              name="senha"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Digite sua senha"
                  />
                </div>
              )}
            />

            <Button type="submit" className="w-full" size="lg">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
