import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../models/user.model';
import { AucSettingsService } from './auc-settings.service';
import { CreateUserDto, GetUserDto } from '../dto/user.dto';
import { AucSettingsModel } from '../models/auc-settings.model';
import { TwitchAuthDataModel } from '../../integration/twitch/models/twitch-auth-data.model';
import { TwitchSettingsModel } from '../../integration/twitch/models/twitch-settings.model';
import { TwitchSettingsService } from '../../integration/twitch/services/twitch-settings.service';
import { DaSettingsService } from '../../integration/da/services/da-settings.service';
import { DaSettingsModel } from '../../integration/da/models/da-settings.model';
import { DaAuthModel } from '../../integration/da/models/da-auth.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private user: typeof UserModel,
    private aucSettingsService: AucSettingsService,
    private twitchSettingsService: TwitchSettingsService,
    private daSettingsService: DaSettingsService,
  ) {}

  async createUser(data: CreateUserDto = {}): Promise<number> {
    const { userId } = await this.user.create(data, { returning: ['userId'] });

    await Promise.all([
      await this.aucSettingsService.create(userId),
      await this.twitchSettingsService.create(userId),
      await this.daSettingsService.create(userId),
    ]);

    return userId;
  }

  async getUserData(id: number): Promise<GetUserDto> {
    return this.user.findByPk(id, {
      include: [
        AucSettingsModel,
        { model: TwitchAuthDataModel, attributes: ['username', 'id'] },
        { model: DaAuthModel, attributes: ['username', 'id'] },
        { model: TwitchSettingsModel, include: ['rewardPresets'] },
        DaSettingsModel,
      ],
      attributes: { exclude: ['twitchAuthId', 'daAuthId'] },
    });
  }
}
