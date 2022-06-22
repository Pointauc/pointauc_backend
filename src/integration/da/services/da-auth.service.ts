import { Injectable } from '@nestjs/common';
import { AbstractOauthService } from '../../abstract/services/abstract-oauth.service';
import {
  IOauthToken,
  IOauthUserData,
} from '../../abstract/dto/abstract-oauth.dto';
import axios from 'axios';
import { InjectModel } from '@nestjs/sequelize';
import { UserService } from '../../../user/services/user.service';
import { DaAuthModel } from '../models/da-auth.model';
import { UserModel } from '../../../user/models/user.model';
import { CreateUserDto } from '../../../user/dto/user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DaAuthService extends AbstractOauthService {
  integrationKey = 'DA';
  redirectUri?: string;
  userTokenKey: keyof CreateUserDto = 'daAuthId';

  constructor(
    @InjectModel(UserModel) public user: typeof UserModel,
    @InjectModel(DaAuthModel)
    public daAuthModel: typeof DaAuthModel,
    public userService: UserService,
    public configService: ConfigService,
  ) {
    super(user, daAuthModel, userService, configService);
  }

  async getToken(extraParams: any): Promise<IOauthToken> {
    const params = { ...this.tokenParams, ...extraParams };

    const { data } = await axios.post(
      'https://www.donationalerts.com/oauth/token',
      params,
    );

    return this.parseTokenResponse(data);
  }

  async getUserData(token: string): Promise<IOauthUserData> {
    const {
      data: {
        data: { id, name: username },
      },
    } = await axios.get('https://www.donationalerts.com/api/v1/user/oauth', {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { id, username };
  }

  refreshToken(userId: number): Promise<IOauthToken> {
    return Promise.resolve(undefined);
  }
}
