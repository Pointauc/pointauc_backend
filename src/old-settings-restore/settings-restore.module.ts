import { Module } from '@nestjs/common';
import { SettingsRestoreService } from './services/settings-restore.service';
import { SettingsRestoreController } from './settings-restore.controller';
import { ConfigModule } from '@nestjs/config';
import { TwitchModule } from '../integration/twitch/twitch.module';

@Module({
  imports: [ConfigModule, TwitchModule],
  providers: [SettingsRestoreService],
  controllers: [SettingsRestoreController],
})
export class SettingsRestoreModule {}
