import { coreService } from "@app/services";
import { useQuery } from "@tanstack/react-query";

export const useAllDenuncias = () => {
  return useQuery({
    queryKey: ["denuncias", "all"],
    queryFn: () => coreService.report.all(),
  });
};

export const useDenunciasResolvidas = () => {
  return useQuery({
    queryKey: ["denuncias", "count", "resolvidas"],
    queryFn: () => coreService.report.countResolved(),
  });
};

export const useDenunciasPendentes = () => {
  return useQuery({
    queryKey: ["denuncias", "count", "pendentes"],
    queryFn: () => coreService.report.countPending(),
  });
};

export const useRecompensasResgatadas = () => {
  return useQuery({
    queryKey: ["recompensas", "count", "resgatadas"],
    queryFn: () => coreService.reward.countRedeemed(),
  });
};