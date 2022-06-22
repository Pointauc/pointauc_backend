import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AucSettingsModel } from '../models/auc-settings.model';
import { AucSettingsDto } from '../dto/auc-settings.dto';

@Injectable()
export class AucSettingsService {
  constructor(
    @InjectModel(AucSettingsModel)
    private aucSettingsModel: typeof AucSettingsModel,
  ) {}

  async create(userId: number): Promise<void> {
    await this.aucSettingsModel.create({ userId });
  }

  async update(userId: number, data: Partial<AucSettingsDto>): Promise<void> {
    await this.aucSettingsModel.update(data, { where: { userId } });
  }
}
