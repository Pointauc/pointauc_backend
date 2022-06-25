export interface ITwitchRedemption {
  id: string;
  user: {
    id: string | number;
    login: string;
    display_name: string;
  };
  channel_id: string;
  redeemed_at: string;
  reward: {
    id: string;
    channel_id: string | number;
    title: string;
    prompt: string;
    cost: string | number;
    is_user_input_required: boolean;
    is_sub_only: boolean;
    image: {
      [k: string]: string;
    };
    default_image: {
      [k: string]: string;
    };
    background_color: string;
    is_enabled: boolean;
    is_paused: boolean;
    is_in_stock: boolean;
    max_per_stream: {
      is_enabled: boolean;
      max_per_stream: string | number;
    };
    should_redemptions_skip_request_queue: boolean;
  };
  user_input: string;
  status: string;
}
