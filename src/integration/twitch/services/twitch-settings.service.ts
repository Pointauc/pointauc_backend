import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TwitchSettingsModel } from '../models/twitch-settings.model';
import { TwitchRewardPresetModel } from '../models/twitch-reward-preset.model';
import { TwitchSettingsDto } from '../dto/twitch-auth.dto';

const initialReward = {
  cost: 1000,
  color: '#ffffff',
};

@Injectable()
export class TwitchSettingsService {
  constructor(
    @InjectModel(TwitchSettingsModel)
    private twitchSettingsModel: typeof TwitchSettingsModel,
    @InjectModel(TwitchRewardPresetModel)
    private twitchRewardPresetModel: typeof TwitchRewardPresetModel,
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
    }
  }
}
