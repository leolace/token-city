import { coreService } from "@app/services";
import type { LoginRequest } from "@app/services/request";
import { useUserStore } from "@app/stores/user";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () => {
  const setReporter = useUserStore((state) => state.setReporter);
  const mutation = useMutation({
    mutationFn: async (req: LoginRequest) => {
      const data = await coreService.login(req);

      return data;
    },
    onSuccess: (data) => {
      setReporter(data);
    },
  });

  return {
    login: mutation.mutateAsync,
    isLoginLoading: mutation.isPending,
  };
};
