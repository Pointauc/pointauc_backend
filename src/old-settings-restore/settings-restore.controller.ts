import { Controller, Get, Param, Session } from '@nestjs/common';
import { SettingsRestoreService } from './services/settings-restore.service';
import { UserSession } from '../user/dto/user.dto';

@Controller('oldUsers')
export class SettingsRestoreController {
  constructor(private settingsRestoreService: SettingsRestoreService) {}

  @Get(':id')
  async getUser(
    @Param('id') id: string,
    @Session() session: UserSession,
  ): Promise<any> {
    return this.settingsRestoreService.getUser(id);
  }

  @Get('cloneIntegration/:id')
  async cloneIntegration(
    @Param('id') id: string,
    @Session() session: UserSession,
  ): Promise<void> {
    if (!session) {
      return;
    }
    session.userId = await this.settingsRestoreService.cloneUserIntegration(id);
  }
}
