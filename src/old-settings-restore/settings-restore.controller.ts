import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { SettingsRestoreService } from './services/settings-restore.service';
import { UserSession } from '../user/dto/user.dto';
import { UserService } from '../user/services/user.service';
import { AuthGuard } from '../core/guards/auth.guard';
import { UserModel } from '../user/models/user.model';

@Controller('oldUsers')
export class SettingsRestoreController {
  constructor(
    private userService: UserService,
    private settingsRestoreService: SettingsRestoreService,
  ) {}

  @UseGuards(new AuthGuard(UserModel))
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

  @Get('hasUser')
  async hasUser(@Query('id') id: string): Promise<boolean> {
    return this.settingsRestoreService.hasUser(id);
  }

  @UseGuards(new AuthGuard(UserModel))
  @Post('restoreSettings')
  async restoreSettings(
    @Body('id') id: string,
    @Session() { userId }: UserSession,
  ): Promise<void> {
    await this.settingsRestoreService.restoreSettings(id, userId);
  }
}
