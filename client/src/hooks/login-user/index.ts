import { coreService } from "@app/services";
import type { LoginRequest } from "@app/services/request";
import { useUserStore } from "@app/stores/user";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () => {
  const setUser = useUserStore((state) => state.setUser);
  const mutation = useMutation({
    mutationFn: async (req: LoginRequest) => {
      const data = await coreService.login(req);

      return data;
    },
    onSuccess: (data) => {
      setUser(data);
    },
  });

  return {
    login: mutation.mutateAsync,
    isLoginLoading: mutation.isPending,
    isLoginSuccess: mutation.isSuccess,
  };
};
