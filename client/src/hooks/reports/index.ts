import { coreService } from "@app/services";
import type { GetPendingReportsRequest } from "@app/services/request";
import { useQuery } from "@tanstack/react-query";

export const useAllDenuncias = () => {
  return useQuery({
    queryKey: ["denuncias", "all"],
    queryFn: () => coreService.report.all(),
  });
};

export const useDenunciasByDepartment = (sigla: string | null) => {
  return useQuery({
    queryKey: ["denuncias", "department", sigla],
    queryFn: () => {
      if (!sigla) throw new Error("Sigla do departamento é necessária");
      return coreService.report.byDepartment(sigla);
    },
    enabled: !!sigla,
  });
};

export const usePendingReports = ({
  category,
  coordinates,
  radius,
}: GetPendingReportsRequest) => {
  const { data: pendingReports } = useQuery({
    queryKey: ["denuncias", "pending", category, coordinates, radius],
    queryFn: async () => {
      return coreService.report.getPending({
        coordinates,
        radius,
        ...(category === "all" ? {} : { category }),
      });
    },
  });

  return { pendingReports: pendingReports?.denuncias || [] };
};
