import { Module } from '@nestjs/common';
import { TwitchSettingsModule } from '../integration/twitch/twitch-settings.module';
import { DaSettingsModule } from '../integration/da/da-settings.module';
import { UserController } from './controllers/user.controller';
import { UserModule } from './user.module';
import { TwitchModule } from '../integration/twitch/twitch.module';
import { DaModule } from '../integration/da/da.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel]),
    UserModule,
    DaModule,
    TwitchModule,
    TwitchSettingsModule,
    DaSettingsModule,
  ],
  controllers: [UserController],
})
export class UserApiModule {}
