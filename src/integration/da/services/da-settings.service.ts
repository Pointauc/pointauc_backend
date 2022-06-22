import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DaSettingsModel } from '../models/da-settings.model';
import { DaSettingsDto } from '../dto/da-settings.dto';

@Injectable()
export class DaSettingsService {
  constructor(
    @InjectModel(DaSettingsModel)
    private daSettingsModel: typeof DaSettingsModel,
  ) {}

  async create(userId: number): Promise<void> {
    await this.daSettingsModel.create({ userId });
  }

  async update(userId: number, data: Partial<DaSettingsDto>) {
    await this.daSettingsModel.update(data, { where: { userId } });
  }
}
