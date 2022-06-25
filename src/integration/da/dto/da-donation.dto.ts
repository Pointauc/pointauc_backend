export interface DaDonationData {
  amount: number;
  amount_in_user_currency: number;
  created_at: string;
  created_at_ts: number;
  currency: string;
  id: number;
  is_shown: number;
  message: string;
  message_type: string;
  name: string;
  payin_system: any;
  reason: string;
  recipient_name: string;
  shown_at: string | null;
  shown_at_ts: number | null;
  username: string;
}

export interface DaCentrifugeMessage {
  data: DaDonationData;
  gen: undefined | number | string;
  offset: undefined | number;
  seq: undefined | number;
}

export interface DaCentrifugeDonationEvent extends DaCentrifugeMessage {
  authId: string;
}
