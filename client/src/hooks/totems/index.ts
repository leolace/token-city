import { coreService } from "@app/services";
import { useQuery } from "@tanstack/react-query";

export const useTotems = () => {
  const { data } = useQuery({
    queryKey: ["totems"],
    queryFn: () => coreService.totem.all(),
  });

  return { totems: data || [] };
};
