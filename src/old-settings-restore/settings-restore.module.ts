import { Module } from '@nestjs/common';
import { SettingsRestoreService } from './services/settings-restore.service';
import { SettingsRestoreController } from './settings-restore.controller';
import { ConfigModule } from '@nestjs/config';
import { TwitchModule } from '../integration/twitch/twitch.module';
import { UserModule } from '../user/user.module';
import { TwitchSettingsModule } from '../integration/twitch/twitch-settings.module';
import { DaSettingsModule } from '../integration/da/da-settings.module';

@Module({
  imports: [
    ConfigModule,
    TwitchModule,
    UserModule,
    TwitchSettingsModule,
    DaSettingsModule,
  ],
  providers: [SettingsRestoreService],
  controllers: [SettingsRestoreController],
})
export class SettingsRestoreModule {}
