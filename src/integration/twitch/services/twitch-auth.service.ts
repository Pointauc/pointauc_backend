import { Injectable } from '@nestjs/common';
import { AbstractOauthService } from '../../abstract/services/abstract-oauth.service';
import {
  IOauthToken,
  IOauthUserData,
} from '../../abstract/dto/abstract-oauth.dto';
import axios from 'axios';
import { InjectModel } from '@nestjs/sequelize';
import { TwitchAuthDataModel } from '../models/twitch-auth-data.model';
import { UserService } from '../../../user/services/user.service';
import {
  TwitchAuthTokenDto,
  TwitchAuthTokenResponse,
} from '../dto/twitch-auth.dto';
import { UserModel } from '../../../user/models/user.model';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwitchAuthService extends AbstractOauthService {
  integrationKey = 'TWITCH';
  redirectUri? = 'http://localhost:3000/twitch/redirect';
  userTokenKey: keyof CreateUserDto = 'twitchAuthId';

  constructor(
    @InjectModel(UserModel) public user: typeof UserModel,
    @InjectModel(TwitchAuthDataModel)
    public twitchAuthDataModel: typeof TwitchAuthDataModel,
    public userService: UserService,
    public configService: ConfigService,
  ) {
    super(user, twitchAuthDataModel, userService, configService);
  }

  async getToken(extraParams: any): Promise<TwitchAuthTokenDto> {
    const params = { ...this.tokenParams, ...extraParams };
    const { data } = await axios.post(
      'https://id.twitch.tv/oauth2/token',
      undefined,
      { params },
    );

    return this.parseTokenResponse(data);
  }

  override parseTokenResponse(
    tokenData: TwitchAuthTokenResponse,
  ): TwitchAuthTokenDto {
    return {
      ...super.parseTokenResponse(tokenData),
      scope: tokenData.scope,
      tokenType: tokenData.token_type,
    };
  }

  async getUserData(token: string): Promise<IOauthUserData> {
    const {
      data: {
        data: [{ id, login: username }],
      },
    } = await axios.get('https://api.twitch.tv/helix/users', {
      headers: {
        'Client-ID': this.appCredentials.clientId,
        Authorization: `Bearer ${token}`,
      },
    });

    return { id, username };
  }

  async refreshToken(userId: number): Promise<IOauthToken> {
    console.log('refreshing token');
    const params = await this.getRefreshTokenParams(userId);
    const { data } = await axios.post(
      'https://id.twitch.tv/oauth2/token',
      undefined,
      { params, responseType: 'json' },
    );

    return data;
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      // await axios.get('https://id.twitch.tv/oauth2/validate', {
      //   headers: { Authorization: `OAuth ${token}` },
      // });
      await this.getUserData(token);

      return true;
    } catch (e) {
      return false;
    }
  }
}
