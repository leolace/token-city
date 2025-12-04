import { useQuery } from "@tanstack/react-query";
import { client } from "@app/services/client";
import { endpoints } from "@app/services/endpoints";
import type { Report } from "@app/types/report";
import { useOperatorStore } from "@app/stores/operator";

export const useAllReports = () => {
  const { operator } = useOperatorStore();
  
  return useQuery({
    queryKey: ["reports", "departments", operator?.departamentos],
    queryFn: async () => {
      if (!operator?.departamentos || operator.departamentos.length === 0) {
        throw new Error("Operador não está logado ou não tem departamentos");
      }
      const data = await client.post(endpoints.report.byDepartments, { 
        json: operator.departamentos 
      }).json<Report[]>();
      return data;
    },
    enabled: !!operator?.departamentos && operator.departamentos.length > 0,
  });
};
