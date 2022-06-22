import {
  AuthDataDto,
  IOauthToken,
  IOauthTokenResponse,
} from '../../abstract/dto/abstract-oauth.dto';

export interface TwitchAuthTokenResponse extends IOauthTokenResponse {
  scope: string[];
  token_type: string;
}

export interface TwitchAuthTokenDto extends IOauthToken {
  scope: string[];
  tokenType: string;
}

export type TwitchAuthData = AuthDataDto<TwitchAuthTokenDto>;

export interface TwitchRewardPresetDto {
  cost: number;
  color: string;
}

export interface TwitchSettingsDto {
  isRefundAvailable: boolean;
  dynamicRewards: boolean;
  rewardsPrefix: string;
  rewardPresets: TwitchRewardPresetDto[];
}
