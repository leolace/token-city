import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Building2,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@app/components/primitives/card";
import { Button } from "@app/components/primitives/button";
import { Badge } from "@app/components/primitives/badge";
import { TotemMap } from "@app/components/totem-map";
import { TotemMark } from "@app/components/totem-mark";
import { coreService } from "@app/services";
import { getCords } from "@app/utils/get-cords";
import dayjs from "dayjs";

export const ReportPage = () => {
  const { userId, date, coordinates } = useParams<{
    userId: string;
    date: string;
    coordinates: string;
  }>();
  const navigate = useNavigate();

  const {
    data: report,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["report", userId, date, coordinates],
    queryFn: () =>
      coreService.report.get({
        userId: userId!,
        date: date!,
        coordenadas: coordinates!,
      }),
    enabled: !!userId && !!date && !!coordinates,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-sidebar-foreground/70">Carregando denúncia...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="text-sidebar-foreground/70">Denúncia não encontrada</p>
        <Button onClick={() => navigate("/admin/denuncias")}>
          Voltar para Denúncias
        </Button>
      </div>
    );
  }

  const coords = getCords(report.coordenadas);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolvida":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "em andamento":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "em validação":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "registrada":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getPriorityLabel = (priority: string) => {
    const p = parseInt(priority);
    if (p === 1) return "Baixa";
    if (p === 2) return "Média";
    if (p === 3) return "Alta";
    return "Não definida";
  };

  const getPriorityColor = (priority: string) => {
    const p = parseInt(priority);
    if (p === 1) return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    if (p === 2) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    if (p === 3) return "bg-red-500/10 text-red-500 border-red-500/20";
    return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  };

  return (
    <div className="grid gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/denuncias")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Detalhes da Denúncia</h1>
          <p className="text-sidebar-foreground/70 mt-1">
            Visualize todas as informações da denúncia
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status e Informações Principais */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2 flex-wrap">
              <Badge className={getStatusColor(report.status)}>
                {report.status}
              </Badge>
              <Badge className={getPriorityColor(report.prioridade)}>
                Prioridade: {getPriorityLabel(report.prioridade)}
              </Badge>
              <Badge
                variant={report.valida === "true" ? "default" : "secondary"}
              >
                {report.valida === "true" ? "Validada" : "Não Validada"}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-sidebar-foreground/70 mt-0.5" />
                <div>
                  <p className="text-sm text-sidebar-foreground/70">
                    Data de Registro
                  </p>
                  <p className="font-medium">
                    {dayjs(report.data).format("DD/MM/YYYY")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-sidebar-foreground/70 mt-0.5" />
                <div>
                  <p className="text-sm text-sidebar-foreground/70">
                    Denunciante
                  </p>
                  <p className="font-medium">{report.nome_usuario}</p>
                  <p className="text-sm text-sidebar-foreground/70">
                    {report.email_usuario}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 font-mono">
                    CPF: {report.usuario}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-sidebar-foreground/70 mt-0.5" />
                <div>
                  <p className="text-sm text-sidebar-foreground/70">
                    Departamento Responsável
                  </p>
                  <p className="font-medium">
                    {report.nome_departamento || "Não atribuído"}
                  </p>
                  {report.sigla && (
                    <p className="text-sm text-sidebar-foreground/70">
                      Sigla: {report.sigla}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sidebar-foreground/70 mt-0.5" />
                <div>
                  <p className="text-sm text-sidebar-foreground/70">
                    Localização do Totem
                  </p>
                  <p className="font-medium">
                    {report.cidade_totem}, {report.estado_totem}
                  </p>
                  <p className="text-sm text-sidebar-foreground/70">
                    Totem: {report.totem}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 font-mono mt-1">
                    Coordenadas: {report.coordenadas}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Descrição da Denúncia</h3>
              <p className="text-sidebar-foreground/80 whitespace-pre-wrap">
                {report.descricao}
              </p>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Histórico de Status</h3>
              <div className="space-y-0">
                {report.historico && report.historico.length > 0 ? (
                  <div className="relative">
                    {/* Linha vertical da timeline */}
                    <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-border" />

                    {report.historico.map((item, index) => (
                      <div
                        key={index}
                        className="relative flex gap-4 pb-4 last:pb-0"
                      >
                        {/* Indicador de ponto */}
                        <div className="relative z-10 flex-shrink-0">
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              index === 0
                                ? "bg-primary border-primary"
                                : "bg-background border-muted-foreground"
                            }`}
                          />
                        </div>

                        {/* Conteúdo */}
                        <div className="flex-1 pt-0.5 pb-2">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p
                                className={`font-medium ${index === 0 ? "text-primary" : ""}`}
                              >
                                {item.status}
                              </p>
                              {index === 0 && (
                                <Badge className="mt-1" variant="default">
                                  Status Atual
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-sidebar-foreground/70 whitespace-nowrap">
                              {dayjs(item.data_historico).format(
                                "DD/MM/YYYY HH:mm",
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-sidebar-foreground/70">
                    Nenhum histórico disponível
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mapa */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Localização no Mapa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[500px] rounded-lg overflow-hidden border">
              <TotemMap
                initialViewState={{
                  zoom: 15,
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                }}
              >
                <TotemMark
                  latitude={coords.latitude}
                  longitude={coords.longitude}
                  tooltip={{
                    content: "Local da Denúncia",
                    options: { defaultOpen: true },
                  }}
                  selected
                />
              </TotemMap>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Imagens (placeholder para futuras implementações) */}
      <Card>
        <CardHeader>
          <CardTitle>Mídias Anexadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-sidebar-foreground/70">
            <p>Nenhuma mídia anexada a esta denúncia</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
