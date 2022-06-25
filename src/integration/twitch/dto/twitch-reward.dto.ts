export interface IReward {
  id: string;
  title: string;
  cost: number;
  broadcaster_id: string;
  background_color: string;
  is_user_input_required: boolean;
}

export interface IRewardUpdate {
  is_enabled?: boolean;
  title?: string;
}

export interface IRewardsResponse {
  data: IReward[];
}
