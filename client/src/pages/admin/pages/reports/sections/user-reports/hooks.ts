import { coreService } from "@app/services";
import { useQuery } from "@tanstack/react-query";

interface Props {
  state: string;
  city: string;
}

export const useGetMostRecentsReportsByCity = ({ state, city }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["reports", "city", state, city],
    queryFn: () => coreService.report.getMostRecent({ state, city }),
  });

  // Agrupar denúncias por usuário
  const reportsByUser =
    data?.denuncias.reduce(
      (acc, report) => {
        if (!acc[report.nomeUsuario]) {
          acc[report.nomeUsuario] = [];
        }
        acc[report.nomeUsuario].push(report);
        return acc;
      },
      {} as Record<string, typeof data.denuncias>,
    ) || {};

  // Ordenar usuários alfabeticamente e suas denúncias por data (mais recentes primeiro)
  const sortedReports = Object.keys(reportsByUser)
    .sort((a, b) => a.localeCompare(b))
    .map((userName) => ({
      nomeUsuario: userName,
      denuncias: reportsByUser[userName].sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
      ),
      totalDenuncias: reportsByUser[userName].length,
    }));

  return { reports: sortedReports, isReportsLoading: isLoading };
};
