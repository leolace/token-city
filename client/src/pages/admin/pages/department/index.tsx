import {
  useDepartmentsByStatus,
  useDepartmentsFullService,
} from "@app/hooks/departments";
import { Card, CardContent } from "@app/components/primitives/card";
import { Badge } from "@app/components/primitives/badge";
import {
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  BarChart3,
  TrendingUp,
} from "lucide-react";

export const DepartmentPage = () => {
  const { data, isLoading } = useDepartmentsByStatus();
  const { data: fullServiceData, isLoading: isLoadingFullService } =
    useDepartmentsFullService();

  const departments = data?.departamentos || [];
  const fullServiceDepartments = fullServiceData?.departamentos || [];

  // Criar Set para verificação rápida
  const fullServiceSet = new Set(
    fullServiceDepartments.map((dept) => dept.sigla),
  );

  // Agrupar departamentos por sigla
  const groupedDepartments = departments.reduce(
    (acc, dept) => {
      if (!acc[dept.siglaDepartamento]) {
        acc[dept.siglaDepartamento] = [];
      }
      acc[dept.siglaDepartamento].push(dept);
      return acc;
    },
    {} as Record<string, typeof departments>,
  );

  // Ordenar alfabeticamente
  const sortedDepartmentKeys = Object.keys(groupedDepartments).sort((a, b) =>
    a.localeCompare(b),
  );

  // Calcular total de denúncias
  const totalDenuncias = departments.reduce(
    (acc, dept) => acc + Number(dept.totalDenuncias),
    0,
  );

  // Função para obter cor e ícone por status
  const getStatusInfo = (status: string) => {
    const statusLower = status.toLowerCase();
    if (
      statusLower.includes("resolvida") ||
      statusLower.includes("resolvido")
    ) {
      return {
        color: "text-green-600",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
        progressColor: "bg-green-500/50",
        icon: CheckCircle2,
      };
    }
    if (
      statusLower.includes("rejeitada") ||
      statusLower.includes("rejeitado")
    ) {
      return {
        color: "text-red-600",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
        progressColor: "bg-red-500/50",
        icon: XCircle,
      };
    }
    if (statusLower.includes("andamento")) {
      return {
        color: "text-yellow-600",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/20",
        progressColor: "bg-yellow-500/50",
        icon: Clock,
      };
    }
    return {
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      progressColor: "bg-blue-500/50",
      icon: AlertCircle,
    };
  };

  return (
    <div className="grid gap-6 p-6">
      {/* Header com métricas */}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Departamentos</h1>
            </div>
            <p className="text-sidebar-foreground/70 ml-14">
              Monitoramento de denúncias por departamento e status
            </p>
          </div>
        </div>

        {/* Cards de métricas */}
        {departments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-primary/20 bg-linear-to-br from-primary/5 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-sidebar-foreground/70">
                      Total de Denúncias
                    </p>
                    <p className="text-3xl font-bold text-primary mt-1">
                      {totalDenuncias}
                    </p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-linear-to-br from-blue-500/5 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-sidebar-foreground/70">
                      Departamentos Ativos
                    </p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">
                      {sortedDepartmentKeys.length}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-full">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-500/20 bg-linear-to-br from-green-500/5 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-sidebar-foreground/70">
                      Serviço Completo
                    </p>
                    <p className="text-3xl font-bold text-green-600 mt-1">
                      {fullServiceDepartments.length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-full">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {isLoading || isLoadingFullService ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-sidebar-foreground/70">
            Carregando departamentos...
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedDepartmentKeys.map((sigla) => {
            const deptStatuses = groupedDepartments[sigla];
            const totalDenunciasDept = deptStatuses.reduce(
              (acc, dept) => acc + Number(dept.totalDenuncias),
              0,
            );

            const hasFullService = fullServiceSet.has(sigla);

            return (
              <Card
                key={sigla}
                className={` ${
                  hasFullService ? "border-green-500 border-2" : ""
                }`}
              >
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                          hasFullService
                            ? "bg-linear-to-br from-green-500/20 to-green-600/10 shadow-lg shadow-green-500/20"
                            : "bg-linear-to-br from-primary/20 to-primary/10"
                        }`}
                      >
                        <Building2
                          className={`w-7 h-7 ${
                            hasFullService ? "text-green-600" : "text-primary"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex flex-col gap-1">
                          <h3 className="text-xl font-bold text-sidebar-foreground">
                            {sigla}
                          </h3>
                          {hasFullService && (
                            <Badge
                              variant="default"
                              className="bg-green-600 hover:bg-green-700 text-xs w-fit"
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Atende Todas
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-sidebar-foreground/60 mb-1">
                        Total
                      </p>
                      <Badge className="text-lg font-bold px-3 py-1">
                        {totalDenunciasDept}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {deptStatuses.map((dept, idx) => {
                      const statusInfo = getStatusInfo(dept.statusAtual);
                      const StatusIcon = statusInfo.icon;

                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border ${statusInfo.bgColor} ${statusInfo.borderColor} transition-all hover:shadow-md`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <StatusIcon
                                className={`w-4 h-4 ${statusInfo.color}`}
                              />
                              <p
                                className={`text-sm font-semibold ${statusInfo.color}`}
                              >
                                {dept.statusAtual}
                              </p>
                            </div>
                            <Badge className={` font-bold`}>
                              {dept.totalDenuncias}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-sidebar-foreground/60">
                              Denúncias neste status
                            </span>
                            <div className="flex items-center gap-1">
                              <div className="w-20 h-1.5 bg-sidebar-foreground/10 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${statusInfo.progressColor} transition-all`}
                                  style={{
                                    width: `${Math.min((Number(dept.totalDenuncias) / totalDenunciasDept) * 100, 100)}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs text-sidebar-foreground/60 min-w-10 text-right">
                                {Math.round(
                                  (Number(dept.totalDenuncias) /
                                    totalDenunciasDept) *
                                    100,
                                )}
                                %
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-3 border-t mt-3">
                    <div className="flex justify-between items-center p-2 bg-primary/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-sidebar-foreground">
                          Total Departamento
                        </span>
                      </div>
                      <span className="text-lg font-bold text-primary">
                        {totalDenunciasDept}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {sortedDepartmentKeys.length === 0 && (
            <Card className="col-span-full border-dashed">
              <CardContent className="text-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-muted rounded-full">
                    <Building2 className="w-12 h-12 text-sidebar-foreground/30" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-sidebar-foreground mb-1">
                      Nenhum departamento encontrado
                    </h3>
                    <p className="text-sm text-sidebar-foreground/60">
                      Não há dados de departamentos disponíveis no momento
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
