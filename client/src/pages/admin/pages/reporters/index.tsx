import { Card, CardContent } from "@app/components/primitives/card";
import { Badge } from "@app/components/primitives/badge";
import { Item, ItemContent, ItemHeader } from "@app/components/primitives/item";
import { useTopReporter } from "./hooks";
import { formatCPF } from "@app/lib/utils";

export const ReportersPage = () => {
  const { data: reporter, isLoading } = useTopReporter();

  return (
    <div className="grid gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Denunciante em Destaque</h1>
        <p className="text-sidebar-foreground/70 mt-1">
          Denunciante com maior contribuição
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-sidebar-foreground/70">
            Carregando denunciante...
          </p>
        </div>
      ) : reporter ? (
        <div className="max-w-2xl mx-auto w-full">
          <Card className="border-2">
            <CardContent className="space-y-6 p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">
                    {reporter.nome.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-sidebar-foreground">
                    {reporter.nome}
                  </h2>
                  <p className="text-sidebar-foreground/70 mt-1">
                    {formatCPF(reporter.cpf)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Item variant="muted">
                  <ItemHeader>
                    <p className="font-medium">Saldo de Tokens</p>
                  </ItemHeader>
                  <ItemContent>
                    <div className="flex items-center justify-between">
                      <Badge className="text-lg px-4 py-2">
                        {reporter.saldo_tokens} tokens
                      </Badge>
                    </div>
                  </ItemContent>
                </Item>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="max-w-2xl mx-auto w-full">
          <CardContent>
            <p className="text-sidebar-foreground/70 text-center py-12">
              Nenhum denunciante encontrado
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
