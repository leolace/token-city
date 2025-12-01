import { Card, CardContent } from "@app/components/primitives/card";
import {
  useAllDenuncias,
  useDenunciasPendentes,
  useDenunciasResolvidas,
  useRecompensasResgatadas,
} from "./hooks/metrics";

export const DashboardPage = () => {
  const { data: allDenuncias } = useAllDenuncias();
  const { data: resolvidas } = useDenunciasResolvidas();
  const { data: pendentes } = useDenunciasPendentes();
  const { data: resgatadas } = useRecompensasResgatadas();

  const novasDenuncias = allDenuncias?.length ?? 0;
  const denunciasResolvidas = resolvidas?.count ?? 0;
  const denunciasPendentes = pendentes?.count ?? 0;
  const recompensasResgatadas = resgatadas?.count ?? 0;

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-sidebar-accent border-sidebar-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2 text-sidebar-accent-foreground">
              Novas denúncias
            </h3>
            <p className="text-4xl font-bold text-sidebar-accent-foreground">
              {novasDenuncias}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-sidebar-accent border-sidebar-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2 text-sidebar-accent-foreground">
              Denúncias resolvidas
            </h3>
            <p className="text-4xl font-bold text-sidebar-accent-foreground">
              {denunciasResolvidas}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-sidebar-accent border-sidebar-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2 text-sidebar-accent-foreground">
              Denúncias pendentes
            </h3>
            <p className="text-4xl font-bold text-sidebar-accent-foreground">
              {denunciasPendentes}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-sidebar-accent border-sidebar-border">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-2 text-sidebar-accent-foreground">
            Recompensas resgatadas
          </h3>
          <p className="text-4xl font-bold text-sidebar-accent-foreground">
            {recompensasResgatadas}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
