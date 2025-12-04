import { Card, CardContent } from "@app/components/primitives/card";
import { useAllReports } from "./hooks";
import { ReportListWithStatus } from "./components/report-list";
import { Spinner } from "@app/components/primitives/spinner";

export const AllReports = () => {
  const { data: reports, isLoading, error } = useAllReports();

  console.log("Reports:", reports);
  console.log("Is Loading:", isLoading);
  console.log("Error:", error);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gerenciar Denúncias</h2>

      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              Erro ao carregar denúncias: {error.message}
            </div>
          ) : (
            <ReportListWithStatus reports={reports || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
