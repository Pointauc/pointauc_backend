import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TwitchAuthDataModel } from './models/twitch-auth-data.model';
import { TwitchController } from './controllers/twitch.controller';
import { TwitchAuthService } from './services/twitch-auth.service';
import { UserModule } from '../../user/user.module';
import { UserModel } from '../../user/models/user.model';
import { TwitchBidsGateway } from './services/twitch-bids.gateway';
import { ConfigModule } from '@nestjs/config';
import { TwitchPubSubService } from './services/twitch-pub-sub.service';
import { TwitchRewardsModule } from './twitch-rewards.module';

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel, TwitchAuthDataModel]),
    UserModule,
    ConfigModule,
    TwitchRewardsModule,
  ],
  providers: [TwitchAuthService, TwitchPubSubService, TwitchBidsGateway],
  controllers: [TwitchController],
  exports: [TwitchAuthService],
})
export class TwitchModule {}
