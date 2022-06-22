import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TwitchSettingsModel } from './models/twitch-settings.model';
import { TwitchRewardPresetModel } from './models/twitch-reward-preset.model';
import { TwitchSettingsService } from './services/twitch-settings.service';

@Module({
  imports: [
    SequelizeModule.forFeature([TwitchSettingsModel, TwitchRewardPresetModel]),
  ],
  providers: [TwitchSettingsService],
  exports: [TwitchSettingsService],
})
export class TwitchSettingsModule {}
