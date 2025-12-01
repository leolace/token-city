import { Button } from "@app/components/primitives/button";
import { Card, CardContent } from "@app/components/primitives/card";
import { CircleCheck } from "lucide-react";
import { useNavigate } from "react-router";

export const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <Card className="max-w-lg mx-auto mt-20">
      <CardContent>
        <CircleCheck className="mx-auto mb-8 text-green-600" size={64} />

        <h1 className="text-3xl font-semibold">
          Denúncia enviada com sucesso!
        </h1>
        <p className="mt-4 text-lg">
          Agradecemos por contribuir para a melhoria da sua comunidade.
        </p>

        <div className="mt-6">
          <Button size="xl" onClick={() => navigate("/")}>
            Voltar para a página inicial
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
