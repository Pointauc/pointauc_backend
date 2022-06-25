import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TwitchSettingsModel } from './models/twitch-settings.model';
import { TwitchRewardPresetModel } from './models/twitch-reward-preset.model';
import { TwitchSettingsService } from './services/twitch-settings.service';
import { TwitchAuthDataModel } from './models/twitch-auth-data.model';
import { TwitchRewardsModule } from './twitch-rewards.module';
import { UserModel } from '../../user/models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      TwitchSettingsModel,
      TwitchRewardPresetModel,
      TwitchAuthDataModel,
      UserModel,
    ]),
    TwitchRewardsModule,
  ],
  providers: [TwitchSettingsService],
  exports: [TwitchSettingsService],
})
export class TwitchSettingsModule {}
