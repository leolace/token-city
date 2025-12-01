import { coreService } from "@app/services";
import type { ReporterProfileRequest } from "@app/services/request";
import { useUserStore } from "@app/stores/user";
import { useMutation } from "@tanstack/react-query";

export const useReporterProfileMutation = () => {
  const setReporter = useUserStore((state) => state.setReporter);

  const { data, mutateAsync } = useMutation({
    mutationFn: async ({ cpf }: ReporterProfileRequest) => {
      console.log("Fetching reporter profile for CPF:", cpf);
      const data = await coreService.reporter.profile({ cpf });

      return data;
    },
    onSuccess: (data) => {
      setReporter(data);
    },
  });

  return { mutateReporterProfile: mutateAsync, reporterProfile: data };
};
