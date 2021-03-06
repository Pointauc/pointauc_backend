import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import User, { IUser } from '../models/user';
import { TwitchAuthService } from '../../integration/twitch/services/twitch-auth.service';
import { TwitchAuthData } from '../../integration/twitch/dto/twitch-auth.dto';
import { AucSettingsService } from '../../user/services/auc-settings.service';
import { TwitchSettingsService } from '../../integration/twitch/services/twitch-settings.service';
import { DaSettingsService } from '../../integration/da/services/da-settings.service';

@Injectable()
export class SettingsRestoreService {
  constructor(
    private config: ConfigService,
    private twitchAuthService: TwitchAuthService,
    private aucSettingsService: AucSettingsService,
    private twitchSettingsService: TwitchSettingsService,
    private daSettingsService: DaSettingsService,
  ) {
    this.connectMongoDb();
  }

  async getUser(channelId: string): Promise<IUser> {
    return User.findOne({ channelId });
  }

  private async connectMongoDb(): Promise<void> {
    await mongoose.connect(this.config.get('MONGODB_ATLAS_CONNECTION_URL'));

    const connection = mongoose.connection;

    connection.on('error', (err) => {
      console.log(err);
    });
    connection.on('open', () => console.log('mongoose connected'));
  }

  async hasUser(channelId: string): Promise<boolean> {
    const res = await User.exists({ channelId });

    return !!res;
  }

  async cloneUserIntegration(channelId: string): Promise<number> {
    const {
      channelId: id,
      username,
      twitchToken: {
        scope,
        token_type,
        refresh_token,
        access_token,
        expires_in,
      },
    } = await this.getUser(channelId);
    const authData: TwitchAuthData = {
      id,
      username,
      scope,
      expiresIn: expires_in,
      refreshToken: refresh_token,
      tokenType: token_type,
      accessToken: access_token,
    };

    return await this.twitchAuthService.createAuthData(authData);
  }

  async restoreSettings(channelId: string, userId: number): Promise<void> {
    const {
      settings,
      integration: {
        twitch: { rewards, ...twitch },
        da,
      },
    } = await this.getUser(channelId);

    await Promise.all([
      this.aucSettingsService.update(
        userId,
        JSON.parse(JSON.stringify(settings)),
      ),
      this.twitchSettingsService.update(
        userId,
        JSON.parse(JSON.stringify({ ...twitch, rewardPresets: rewards })),
      ),
      this.daSettingsService.update(userId, JSON.parse(JSON.stringify(da))),
    ]);
  }
}
