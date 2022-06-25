import { Module } from '@nestjs/common';
import { TwitchRewardsService } from './services/twitch-rewards.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [TwitchRewardsService],
  exports: [TwitchRewardsService],
})
export class TwitchRewardsModule {}
