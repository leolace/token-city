import { coreService } from "@app/services";
import type { GetPendingReportsRequest } from "@app/services/request";
import { useQuery } from "@tanstack/react-query";

export const useAllDenuncias = () => {
  return useQuery({
    queryKey: ["denuncias", "all"],
    queryFn: () => coreService.report.all(),
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
