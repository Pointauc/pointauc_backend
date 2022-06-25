import {
  AuthDataDto,
  IAppCredentials,
  IOauthToken,
  IOauthTokenResponse,
  IOauthUserData,
} from '../dto/abstract-oauth.dto';
import { AbstractOauthTokenModel } from '../models/abstract-oauth-token.model';
import { UserService } from '../../../user/services/user.service';
import { UserModel } from '../../../user/models/user.model';
import { CreateUserDto } from '../../../user/dto/user.dto';
import { ConfigService } from '@nestjs/config';

const grantType = {
  authToken: 'authorization_code',
  refreshToken: 'refresh_token',
};

export abstract class AbstractOauthService {
  abstract integrationKey: string;
  abstract redirectUri?: string;
  abstract userTokenKey: keyof CreateUserDto;

  get appCredentials(): IAppCredentials {
    return {
      clientId: this.configService.get(`${this.integrationKey}_CLIENT_ID`),
      clientSecret: this.configService.get(
        `${this.integrationKey}_CLIENT_SECRET`,
      ),
      redirectUri: this.redirectUri,
    };
  }

  get tokenParams(): any {
    return {
      client_id: this.appCredentials.clientId,
      grant_type: grantType.authToken,
      client_secret: this.appCredentials.clientSecret,
      redirect_uri: this.appCredentials.redirectUri,
    };
  }

  protected constructor(
    public user: typeof UserModel,
    public tokenModel: typeof AbstractOauthTokenModel,
    public userService: UserService,
    public configService: ConfigService,
  ) {}

  parseTokenResponse(tokenData: IOauthTokenResponse): IOauthToken {
    return {
      accessToken: tokenData.access_token,
      expiresIn: tokenData.expires_in,
      refreshToken: tokenData.refresh_token,
    };
  }

  async getRefreshToken(userId: number): Promise<string> {
    const { refreshToken } = await this.tokenModel.findOne({
      where: { userId },
      attributes: ['refreshToken'],
    });

    return refreshToken;
  }

  async getRefreshTokenParams(userId: number): Promise<any> {
    return {
      refresh_token: await this.getRefreshToken(userId),
      grant_type: grantType.refreshToken,
      client_id: this.appCredentials.clientId,
      client_secret: this.appCredentials.clientSecret,
    };
  }

  async authorize(params: any, userId?: number): Promise<number> {
    const tokenData = await this.getToken(params);
    const userData = await this.getUserData(tokenData.accessToken);
    const modelData: AuthDataDto = { ...tokenData, ...userData };

    const savedData = await this.tokenModel.findByPk(modelData.id, {
      attributes: { include: ['userId'] },
    });

    return !!savedData
      ? await this.updateAuthData(
          { ...modelData, userId: savedData.userId },
          userId,
        )
      : await this.createAuthData(modelData, userId);
  }

  async refreshAndUpdateToken(userId: number): Promise<void> {
    const tokenData = this.refreshToken(userId);

    await this.tokenModel.update(tokenData as any, { where: { userId } });
  }

  async setUserAuthId(userId: number, id: string): Promise<void> {
    await this.user.update({ [this.userTokenKey]: id }, { where: { userId } });
  }

  async createAuthData(
    modelData: AuthDataDto,
    userId?: number,
  ): Promise<number> {
    const affectedUserId = userId || (await this.userService.createUser());
    const data = { ...modelData, userId: userId ? null : affectedUserId };
    const { id } = await this.tokenModel.create(data, { returning: ['id'] });
    await this.setUserAuthId(affectedUserId, id);

    return affectedUserId;
  }

  async updateAuthData(
    modelData: AuthDataDto,
    userId?: number,
  ): Promise<number> {
    const shouldCreateUser = !userId && !modelData.userId;

    if (shouldCreateUser) {
      modelData.userId = await this.userService.createUser({
        [this.userTokenKey]: modelData.id,
      });
    }

    if (userId) {
      await this.setUserAuthId(userId, modelData.id);
    }

    await this.tokenModel.update(modelData, { where: { id: modelData.id } });

    return userId || modelData.userId;
  }

  abstract getToken(extraParams: any): Promise<IOauthToken>;

  abstract refreshToken(userId: number): Promise<IOauthToken>;

  abstract getUserData(token: string): Promise<IOauthUserData>;
}