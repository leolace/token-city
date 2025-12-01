import { coreService } from "@app/services";
import type { CreateReportRequest } from "@app/services/request";
import { useMutation } from "@tanstack/react-query";

export const useReportCreateMutation = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async (data: CreateReportRequest) => {
      await coreService.report.create(data);
    },
  });

  return { reportCreateMutate: mutateAsync };
};
