import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import User, { IUser } from '../models/user';
import { TwitchAuthService } from '../../integration/twitch/services/twitch-auth.service';
import { TwitchAuthData } from '../../integration/twitch/dto/twitch-auth.dto';

@Injectable()
export class SettingsRestoreService {
  constructor(
    private config: ConfigService,
    private twitchAuthService: TwitchAuthService,
  ) {
    this.connectMongoDb();
  }

  private async connectMongoDb(): Promise<void> {
    console.log('connecting');
    await mongoose.connect(this.config.get('MONGODB_ATLAS_CONNECTION_URL'));

    const connection = mongoose.connection;

    connection.on('error', (err) => {
      console.log(err);
    });
    connection.on('open', () => console.log('mongoose connected'));
  }

  async getUser(channelId: string): Promise<IUser> {
    return User.findOne({ channelId });
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
}
