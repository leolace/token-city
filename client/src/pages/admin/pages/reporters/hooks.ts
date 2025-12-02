import { coreService } from "@app/services";
import { useQuery } from "@tanstack/react-query";

export const useTopReporter = () => {
  return useQuery({
    queryKey: ["reporters", "top"],
    queryFn: () => coreService.reporter.top(),
  });
};
