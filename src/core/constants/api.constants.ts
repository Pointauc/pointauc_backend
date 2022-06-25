export const ENDPOINTS = {
  CUSTOM_REWARDS: 'https://api.twitch.tv/helix/channel_points/custom_rewards',
  CUSTOM_REDEMPTIONS:
    'https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions',
  VALIDATE_TWITCH: 'https://id.twitch.tv/oauth2/validate',
  CAMILLE_BOT: 'https://camille-bot-beta.glitch.me',
  ACTIVE_EXTENSIONS: 'https://api.twitch.tv/helix/users/extensions',
};

export enum RedemptionStatus {
  Canceled = 'CANCELED',
  Unfulfilled = 'UNFULFILLED',
  Fulfilled = 'FULFILLED',
}
