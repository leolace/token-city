import { useLoginMutation } from "@app/hooks/login-user";
import { coreService } from "@app/services";
import type { LoginRequest } from "@app/services/request";
import { useUserStore } from "@app/stores/user";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export const useReporterLoginMutation = () => {
  const navigate = useNavigate();
  const { login, isLoginLoading } = useLoginMutation();
  const setReporter = useUserStore((state) => state.setReporter);

  const { data, mutate, isPending } = useMutation({
    mutationFn: async (req: LoginRequest) => {
      const { cpf } = await login(req);
      const data = await coreService.reporter.profile({ cpf });

      return data;
    },
    onSuccess: (data) => {
      setReporter(data);
      navigate("/report");
    },
  });

  return {
    loginReporter: mutate,
    reporterProfile: data,
    isReporterLoginLoading: isPending || isLoginLoading,
  };
};
