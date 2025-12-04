import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@app/components/primitives/card";
import { Button } from "@app/components/primitives/button";
import { Badge } from "@app/components/primitives/badge";
import { useUserStore } from "@app/stores/user";
import { coreService } from "@app/services";
import {
  Gift,
  Coins,
  Package,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@app/components/primitives/toggle-group";
import dayjs from "dayjs";

export const RewardsPage = () => {
  const { reporter, setReporter } = useUserStore();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("disponivel");

  // Buscar recompensas disponíveis
  const { data: availableRewards = [], isLoading: loadingAvailable } = useQuery(
    {
      queryKey: ["rewards"],
      queryFn: () => coreService.reward.listAll(),
    },
  );

  // Buscar recompensas resgatadas do usuário
  const { data: userRewards = [], isLoading: loadingUser } = useQuery({
    queryKey: ["user-rewards", reporter?.cpf],
    queryFn: () => coreService.reward.getByUser(reporter?.cpf || ""),
    enabled: !!reporter?.cpf,
  });

  const redeemMutation = useMutation({
    mutationFn: (rewardName: string) =>
      coreService.reward.redeem({
        userId: reporter?.cpf || "",
        rewardId: rewardName,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      queryClient.invalidateQueries({ queryKey: ["user-rewards"] });
      queryClient.invalidateQueries({ queryKey: ["reporter-profile"] });

      // Atualizar saldo com o valor retornado pela API
      if (reporter) {
        setReporter({
          ...reporter,
          saldo_tokens: data.saldo_tokens,
        });
      }
    },
  });

  const handleRedeem = (rewardName: string, valorToken: number) => {
    if (!reporter) return;

    if (reporter.saldo_tokens < valorToken) {
      alert("Tokens insuficientes para resgatar esta recompensa!");
      return;
    }

    if (confirm(`Deseja resgatar "${rewardName}" por ${valorToken} tokens?`)) {
      redeemMutation.mutate(rewardName);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "aprovado":
      case "entregue":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pendente":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "rejeitado":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "aprovado":
      case "entregue":
        return <CheckCircle className="w-4 h-4" />;
      case "pendente":
        return <Clock className="w-4 h-4" />;
      case "rejeitado":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  console.log(selectedTab);

  return (
    <div className="grid gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Minhas Recompensas</h1>
        <p className="text-sidebar-foreground/70 mt-1">
          Resgate recompensas com seus tokens acumulados
        </p>
      </div>

      {/* Card de Saldo */}
      <Card className="bg-linear-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-full bg-primary/20">
              <Coins className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-sidebar-foreground/70">
                Saldo Disponível
              </p>
              <p className="text-4xl font-bold text-primary">
                {reporter?.saldo_tokens || 0}
              </p>
              <p className="text-sm text-sidebar-foreground/60">tokens</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-sidebar-foreground/70 mb-1">
              Recompensas Resgatadas
            </p>
            <p className="text-2xl font-semibold">{userRewards.length}</p>
          </div>
        </CardContent>
      </Card>

      {/* Toggle de Visualização */}
      <div className="flex justify-center">
        <ToggleGroup
          type="single"
          value={selectedTab}
          onValueChange={(value) => value && setSelectedTab(value)}
          variant="outline"
          size="xl"
        >
          <ToggleGroupItem value="disponivel">
            <Gift className="w-4 h-4" />
            Disponíveis
          </ToggleGroupItem>
          <ToggleGroupItem value="resgatadas">
            <Package className="w-4 h-4" />
            Resgatadas
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Recompensas Disponíveis */}
      {selectedTab === "disponivel" && (
        <div className="mt-6">
          {loadingAvailable ? (
            <div className="text-center py-12">
              <p className="text-sidebar-foreground/70">
                Carregando recompensas...
              </p>
            </div>
          ) : availableRewards.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Gift className="w-12 h-12 mx-auto mb-4 text-sidebar-foreground/30" />
                <p className="text-sidebar-foreground/70">
                  Nenhuma recompensa disponível
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableRewards.map((reward) => {
                const valorToken = parseFloat(reward.valor_token);
                const quantidade = parseInt(reward.quantidade);
                const canAfford = (reporter?.saldo_tokens || 0) >= valorToken;
                const hasStock = quantidade > 0;

                return (
                  <Card
                    key={reward.nome}
                    className={`border-2 transition-all ${
                      canAfford && hasStock
                        ? "hover:border-primary/50 hover:shadow-md"
                        : "opacity-60"
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between">
                        <span className="text-lg">{reward.nome}</span>
                        <Gift className="w-6 h-6 text-primary/50 shrink-0" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Valor em Tokens */}
                      <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Coins className="w-5 h-5 text-primary" />
                          <span className="font-semibold text-primary text-lg">
                            {valorToken}
                          </span>
                        </div>
                        <span className="text-sm text-sidebar-foreground/70">
                          tokens
                        </span>
                      </div>

                      {/* Estoque */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-sidebar-foreground/70" />
                          <span className="text-sm text-sidebar-foreground/70">
                            Estoque:
                          </span>
                        </div>
                        <Badge variant={hasStock ? "default" : "secondary"}>
                          {quantidade}{" "}
                          {quantidade === 1 ? "unidade" : "unidades"}
                        </Badge>
                      </div>

                      {/* Botão de Resgate */}
                      <Button
                        className="w-full"
                        disabled={
                          !canAfford || !hasStock || redeemMutation.isPending
                        }
                        onClick={() => handleRedeem(reward.nome, valorToken)}
                        size="xl"
                      >
                        {!hasStock
                          ? "Sem Estoque"
                          : !canAfford
                            ? "Tokens Insuficientes"
                            : redeemMutation.isPending
                              ? "Resgatando..."
                              : "Resgatar"}
                      </Button>

                      {!canAfford && hasStock && (
                        <p className="text-xs text-center text-destructive">
                          Faltam {valorToken - (reporter?.saldo_tokens || 0)}{" "}
                          tokens
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Recompensas Resgatadas */}
      {selectedTab === "resgatadas" && (
        <div className="mt-6">
          {loadingUser ? (
            <div className="text-center py-12">
              <p className="text-sidebar-foreground/70">
                Carregando seus resgates...
              </p>
            </div>
          ) : userRewards.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-12 h-12 mx-auto mb-4 text-sidebar-foreground/30" />
                <p className="text-sidebar-foreground/70">
                  Você ainda não resgatou nenhuma recompensa
                </p>
                <p className="text-sm text-sidebar-foreground/50 mt-2">
                  Acumule tokens fazendo denúncias e resgate recompensas
                  incríveis!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {userRewards.map((reward, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <Gift className="w-5 h-5 text-primary mt-1 shrink-0" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">
                              {reward.nome}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-sidebar-foreground/70">
                              <Coins className="w-4 h-4" />
                              <span>{reward.valor_token} tokens</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-sidebar-foreground/70">
                            <Clock className="w-4 h-4" />
                            <span>
                              Resgatado em{" "}
                              {dayjs(reward.data_resgate).format("DD/MM/YYYY")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Badge className={getStatusColor(reward.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(reward.status)}
                          {reward.status}
                        </span>
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
