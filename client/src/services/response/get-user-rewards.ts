export interface UserReward {
  nome: string;
  quantidade: string;
  valor_token: string;
  data_resgate: string;
  status: string;
}

export type GetUserRewardsResponse = UserReward[];
