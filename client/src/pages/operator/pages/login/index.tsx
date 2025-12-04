import { Button } from "@app/components/primitives/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@app/components/primitives/card";
import { Input } from "@app/components/primitives/input";
import { Label } from "@app/components/primitives/label";
import { operatorLogin } from "@app/services/request/operator-login";
import { useOperatorStore } from "@app/stores/operator";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
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
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { setOperator } = useOperatorStore();

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setError("");
      setIsLoading(true);
      
      try {
        const response = await operatorLogin({
          matricula: value.matricula,
          password: value.senha,
        }) as any;
        
        setOperator({
          cpf: response.cpf,
          nome: response.nome,
          email: response.email,
          matricula: response.matricula.trim(),
          cargo: response.cargo,
          nivel: response.nivel,
          departamentos: response.departamentos || [],
        });
        navigate("/operador/denuncias");
      } catch (err) {
        console.error("Erro no login:", err);
        setError((err as any)?.response?.data?.detail || "Matrícula ou senha inválida");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-sidebar-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-sidebar text-sidebar-foreground border-sidebar-border">
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            Token City - Operador
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

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
