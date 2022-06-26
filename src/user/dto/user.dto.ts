import { AucSettingsDto } from './auc-settings.dto';
import { TwitchSettingsDto } from '../../integration/twitch/dto/twitch-auth.dto';
import { DaSettingsDto } from '../../integration/da/dto/da-settings.dto';

export interface IntegrationDataDto {
  username: string;
  id: string;
}

export interface GetUserDto {
  aucSettings: AucSettingsDto;
  twitchSettings: TwitchSettingsDto;
  twitchAuth: IntegrationDataDto;
  daSettings: DaSettingsDto;
  daAuth: IntegrationDataDto;
}

export interface UserSession {
  userId: number;
}

export interface IntegrationSettingsDto {
  twitch?: Partial<TwitchSettingsDto>;
  da?: Partial<DaSettingsDto>;
}

export interface CreateUserDto {
  twitchAuthId?: string;
  daAuthId?: string;
}
