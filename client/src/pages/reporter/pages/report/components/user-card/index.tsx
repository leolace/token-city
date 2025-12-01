import { Button } from "@app/components/primitives/button";
import { Card, CardAction, CardContent } from "@app/components/primitives/card";

export const UserCard = () => {
  return (
    <Card className="self-start w-full">
      <CardContent className="flex items-center">
        <div className="flex-1">
          <h3 className="text-xl font-medium">Leonardo Gonsalez</h3>
          <p>546.274.128.60</p>
          <p>234 tokens</p>
        </div>

        <CardAction>
          <Button variant="ghost" size="xl">
            Ver recompensas
          </Button>
        </CardAction>
      </CardContent>
    </Card>
  );
};
