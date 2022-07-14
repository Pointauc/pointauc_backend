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
import { Subject } from 'rxjs';
import { SequelizeUtils } from '../../core/utils/sequelize.utils';

@Injectable()
export class UserService {
  $userCreated = new Subject<string>();

  constructor(
    @InjectModel(UserModel) private user: typeof UserModel,
    private aucSettingsService: AucSettingsService,
    private twitchSettingsService: TwitchSettingsService,
    private daSettingsService: DaSettingsService,
  ) {}

  async createUser(data: CreateUserDto = {}, nonce?: string): Promise<number> {
    const { userId } = await this.user.create(data, { returning: ['userId'] });

    await Promise.all([
      this.aucSettingsService.create(userId),
      this.twitchSettingsService.create(userId),
      this.daSettingsService.create(userId),
    ]);

    this.$userCreated.next(nonce);

    return userId;
  }

  async getUserData(id: number): Promise<GetUserDto> {
    return this.user.findByPk(id, {
      include: [
        AucSettingsModel,
        {
          model: TwitchAuthDataModel,
          attributes: [
            'username',
            'id',
            [SequelizeUtils.toBoolean('twitchAuth.accessToken'), 'isValid'],
          ],
        },
        {
          model: DaAuthModel,
          attributes: [
            'username',
            'id',
            [SequelizeUtils.toBoolean('daAuth.accessToken'), 'isValid'],
          ],
        },
        { model: TwitchSettingsModel, include: ['rewardPresets'] },
        DaSettingsModel,
      ],
      attributes: { exclude: ['twitchAuthId', 'daAuthId'] },
    });
  }
}
