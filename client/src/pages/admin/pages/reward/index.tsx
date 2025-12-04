import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@app/components/primitives/card";
import { Button } from "@app/components/primitives/button";
import { Input } from "@app/components/primitives/input";
import { Label } from "@app/components/primitives/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@app/components/primitives/dialog";
import { Badge } from "@app/components/primitives/badge";
import { useRewards } from "@app/hooks/rewards";
import { coreService } from "@app/services";
import { Plus, Gift, Coins, Package } from "lucide-react";
import type { CreateRewardRequest } from "@app/services/request/create-reward";
import type { Reward } from "@app/types/reward";

const defaultForm: CreateRewardRequest = {
  nome: "",
  quantidade: 0,
  valor_token: 0,
};

export const RewardPage = () => {
  const { rewards, isLoading } = useRewards();
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateRewardRequest>(defaultForm);

  const createMutation = useMutation({
    mutationFn: (data: CreateRewardRequest) => coreService.reward.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      setIsOpen(false);
      setFormData(defaultForm);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleChange = (
    field: keyof CreateRewardRequest,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid gap-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Recompensas</h1>
          <p className="text-sidebar-foreground/70 mt-1">
            Visualize e gerencie todas as recompensas do sistema
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Recompensa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Recompensa</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Recompensa</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                  placeholder="Ex: Voucher Netflix"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade Disponível</Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="0"
                  value={formData.quantidade}
                  onChange={(e) =>
                    handleChange("quantidade", parseInt(e.target.value))
                  }
                  placeholder="50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor_token">Valor em Tokens</Label>
                <Input
                  id="valor_token"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.valor_token}
                  onChange={(e) =>
                    handleChange("valor_token", parseFloat(e.target.value))
                  }
                  placeholder="100.00"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 rounded-lg bg-primary/10">
              <Gift className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-sidebar-foreground/70">
                Total de Recompensas
              </p>
              <p className="text-2xl font-bold">{rewards.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 rounded-lg bg-green-500/10">
              <Package className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-sidebar-foreground/70">
                Itens Disponíveis
              </p>
              <p className="text-2xl font-bold">
                {rewards.reduce(
                  (acc: number, r: Reward) =>
                    acc + parseInt(r.quantidade || "0"),
                  0,
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 rounded-lg bg-yellow-500/10">
              <Coins className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-sidebar-foreground/70">
                Valor Médio (Tokens)
              </p>
              <p className="text-2xl font-bold">
                {rewards.length > 0
                  ? (
                      rewards.reduce(
                        (acc: number, r: Reward) =>
                          acc + parseFloat(r.valor_token || "0"),
                        0,
                      ) / rewards.length
                    ).toFixed(2)
                  : "0.00"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Recompensas */}
      <Card>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-sidebar-foreground/70">
                Carregando recompensas...
              </p>
            </div>
          ) : rewards.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="w-12 h-12 mx-auto mb-4 text-sidebar-foreground/30" />
              <p className="text-sidebar-foreground/70">
                Nenhuma recompensa cadastrada
              </p>
              <p className="text-sm text-sidebar-foreground/50 mt-2">
                Clique em "Nova Recompensa" para adicionar a primeira
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map((reward: Reward) => (
                <Card
                  key={reward.nome}
                  className="border-2 hover:border-primary/50 transition-colors"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {reward.nome}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-sidebar-foreground/70">
                          <Coins className="w-4 h-4" />
                          <span>{reward.valor_token} tokens</span>
                        </div>
                      </div>
                      <Gift className="w-8 h-8 text-primary/50" />
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-sidebar-foreground/70" />
                        <span className="text-sm text-sidebar-foreground/70">
                          Estoque:
                        </span>
                      </div>
                      <Badge
                        variant={
                          parseInt(reward.quantidade) > 0
                            ? "default"
                            : "secondary"
                        }
                      >
                        {reward.quantidade}{" "}
                        {parseInt(reward.quantidade) === 1
                          ? "unidade"
                          : "unidades"}
                      </Badge>
                    </div>

                    {parseInt(reward.quantidade) === 0 && (
                      <div className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                        ⚠️ Sem estoque disponível
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
