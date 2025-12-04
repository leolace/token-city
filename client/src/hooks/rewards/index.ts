import { useQuery } from "@tanstack/react-query";
import { coreService } from "@app/services";

export const useRewards = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["rewards"],
    queryFn: coreService.reward.listAll,
  });

  return {
    rewards: data || [],
    isLoading,
    error,
    refetch,
  };
};
