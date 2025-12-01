import { Badge } from "@app/components/primitives/badge";
import { Button } from "@app/components/primitives/button";
import { Card, CardAction, CardContent } from "@app/components/primitives/card";
import { formatCPF } from "@app/lib/utils";
import { useUserStore } from "@app/stores/user";
import { SquareArrowOutUpRight, Wallet } from "lucide-react";

export const UserCard = () => {
  const reporter = useUserStore((state) => state.reporter);
  return (
    <Card className="self-start w-full">
      <CardContent className="flex items-center">
        <div className="flex-1 flex flex-col gap-1">
          <h3 className="text-4xl font-medium">{reporter?.nome}</h3>
          <p className="text-xl text-neutral-600">{formatCPF(reporter?.cpf)}</p>
          <Badge className="text-base">
            <Wallet size={64} />
            <span>{reporter?.saldo_tokens} tokens</span>
          </Badge>
        </div>

        <CardAction>
          <Button variant="ghost" size="xl">
            <SquareArrowOutUpRight />
            Ver recompensas
          </Button>
        </CardAction>
      </CardContent>
    </Card>
  );
};
