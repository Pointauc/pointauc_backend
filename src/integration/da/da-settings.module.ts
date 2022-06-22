import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DaSettingsModel } from './models/da-settings.model';
import { DaSettingsService } from './services/da-settings.service';

@Module({
  imports: [SequelizeModule.forFeature([DaSettingsModel])],
  providers: [DaSettingsService],
  exports: [DaSettingsService],
})
export class DaSettingsModule {}
