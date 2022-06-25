import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TwitchSettingsModel } from '../models/twitch-settings.model';
import { TwitchRewardPresetModel } from '../models/twitch-reward-preset.model';
import {
  TwitchRewardPresetDto,
  TwitchSettingsDto,
} from '../dto/twitch-auth.dto';
import { TwitchAuthDataModel } from '../models/twitch-auth-data.model';
import { TwitchRewardsService } from './twitch-rewards.service';
import { UserModel } from '../../../user/models/user.model';

const initialReward = {
  cost: 5000,
  color: '#F57D07',
};

@Injectable()
export class TwitchSettingsService {
  constructor(
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
    @InjectModel(TwitchSettingsModel)
    private twitchSettingsModel: typeof TwitchSettingsModel,
    @InjectModel(TwitchAuthDataModel)
    private twitchAuthDataModel: typeof TwitchAuthDataModel,
    @InjectModel(TwitchRewardPresetModel)
    private twitchRewardPresetModel: typeof TwitchRewardPresetModel,
    private twitchRewardsService: TwitchRewardsService,
  ) {}

  async create(userId: number): Promise<void> {
    await Promise.all([
      await this.twitchSettingsModel.create({ userId }),
      await this.twitchRewardPresetModel.create({ ...initialReward, userId }),
    ]);
  }

  async update(
    userId: number,
    data: Partial<TwitchSettingsDto>,
  ): Promise<void> {
    const { rewardPresets, ...twitchSettings } = data;

    await this.twitchSettingsModel.update(twitchSettings, {
      where: { userId },
    });

    if (rewardPresets) {
      const newPresets = rewardPresets.map((preset) => ({ ...preset, userId }));

      await this.twitchRewardPresetModel.destroy({ where: { userId } });
      await this.twitchRewardPresetModel.bulkCreate(newPresets);

      try {
        await this.updatePresets(userId, rewardPresets);
      } catch (e) {}
    }
  }

  async updatePresets(
    userId: number,
    rewardPresets: TwitchRewardPresetDto[],
  ): Promise<void> {
    const {
      twitchAuth: { accessToken, id },
      twitchSettings: { rewardsPrefix },
    } = await this.userModel.findByPk(userId, {
      include: ['twitchAuth', 'twitchSettings'],
    });

    await this.twitchRewardsService.refreshRewards(
      rewardPresets,
      rewardsPrefix,
      accessToken,
      id,
    );
  }
}
