import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TwitchAuthDataModel } from './models/twitch-auth-data.model';
import { TwitchController } from './controllers/twitch.controller';
import { TwitchAuthService } from './services/twitch-auth.service';
import { UserModule } from '../../user/user.module';
import { UserModel } from '../../user/models/user.model';
import { TwitchBidsGateway } from './services/twitch-bids.gateway';
import { ConfigModule } from '@nestjs/config';
import { TwitchRewardsService } from './services/twitch-rewards.service';
import { TwitchPubSubService } from './services/twitch-pub-sub.service';

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel, TwitchAuthDataModel]),
    UserModule,
    ConfigModule,
  ],
  providers: [
    TwitchAuthService,
    TwitchRewardsService,
    TwitchPubSubService,
    TwitchBidsGateway,
  ],
  controllers: [TwitchController],
})
export class TwitchModule {}
