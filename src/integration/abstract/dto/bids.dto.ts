export interface IBidsSubscribeResponse {
  error?: string | null;
  state: boolean;
}

export interface IBid {
  timestamp: string;
  cost: number;
  username: string;
  message: string;
  color: string;
  id: string;
  rewardId?: string;
  isDonation?: boolean;
}
