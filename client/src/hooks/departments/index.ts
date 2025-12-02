import { coreService } from "@app/services";
import { useQuery } from "@tanstack/react-query";

export const useDepartmentsByStatus = () => {
  return useQuery({
    queryKey: ["departments", "by-status"],
    queryFn: () => coreService.department.byStatus(),
  });
};

export const useDepartmentsFullService = () => {
  return useQuery({
    queryKey: ["departments", "full-service"],
    queryFn: () => coreService.department.fullService(),
  });
};
