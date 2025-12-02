import {
  useDepartmentsByStatus,
  useDepartmentsFullService,
} from "@app/hooks/departments";
import { Card, CardContent } from "@app/components/primitives/card";
import { Badge } from "@app/components/primitives/badge";
import { Item, ItemContent, ItemHeader } from "@app/components/primitives/item";

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

  return (
    <div className="grid gap-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Departamentos</h1>
          <p className="text-sidebar-foreground/70 mt-1">
            Monitoramento de denúncias por departamento e status
          </p>
        </div>
        {departments.length > 0 && (
          <Badge variant="secondary" className="text-base">
            Total de Denúncias: {totalDenuncias}
          </Badge>
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
                className={`hover:shadow-lg transition-shadow ${
                  hasFullService ? "border-green-500 border-2" : ""
                }`}
              >
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          hasFullService ? "bg-green-500/20" : "bg-primary/20"
                        }`}
                      >
                        <span
                          className={`text-lg font-bold ${
                            hasFullService ? "text-green-600" : "text-primary"
                          }`}
                        >
                          {sigla}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-sidebar-foreground">
                            {sigla}
                          </h3>
                          {hasFullService && (
                            <Badge
                              variant="default"
                              className="bg-green-600 hover:bg-green-700 text-xs"
                            >
                              ✓ Atende Todas
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-sidebar-foreground/70">
                          {deptStatuses.length}{" "}
                          {deptStatuses.length === 1 ? "status" : "status"}
                        </p>
                      </div>
                    </div>
                    <Badge className="text-base font-bold">
                      {totalDenunciasDept}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {deptStatuses.map((dept, idx) => (
                      <Item key={idx} variant="muted">
                        <ItemHeader>
                          <div className="flex justify-between items-center w-full">
                            <p className="text-sm font-medium">
                              Status: {dept.statusAtual}
                            </p>
                            <Badge
                              variant={
                                dept.statusAtual.toLowerCase() === "ativo"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {dept.statusAtual}
                            </Badge>
                          </div>
                        </ItemHeader>
                        <ItemContent>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-sidebar-foreground/70">
                              Denúncias neste status
                            </span>
                            <Badge className="font-bold">
                              {dept.totalDenuncias}
                            </Badge>
                          </div>
                        </ItemContent>
                      </Item>
                    ))}
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-sidebar-foreground">
                        Total Departamento
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {totalDenunciasDept} denúncias
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {sortedDepartmentKeys.length === 0 && (
            <Card className="col-span-full">
              <CardContent>
                <p className="text-sidebar-foreground/70 text-center py-12">
                  Nenhum departamento encontrado
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
