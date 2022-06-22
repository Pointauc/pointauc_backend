import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './models/user.model';
import { AucSettingsModel } from './models/auc-settings.model';
import { UserController } from './controllers/user.controller';
import { AucSettingsService } from './services/auc-settings.service';
import { UserService } from './services/user.service';
import { TwitchSettingsModule } from '../integration/twitch/twitch-settings.module';
import { DaSettingsModule } from '../integration/da/da-settings.module';

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel, AucSettingsModel]),
    TwitchSettingsModule,
    DaSettingsModule,
  ],
  controllers: [UserController],
  providers: [AucSettingsService, UserService],
  exports: [UserService],
})
export class UserModule {}
