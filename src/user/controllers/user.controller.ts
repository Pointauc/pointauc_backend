import { Body, Controller, Get, Put, Session, UseGuards } from '@nestjs/common';
import {
  GetUserDto,
  IntegrationSettingsDto,
  UserSession,
} from '../dto/user.dto';
import { UserService } from '../services/user.service';
import { AuthGuard } from '../../core/guards/auth.guard';
import { UserModel } from '../models/user.model';
import { TwitchSettingsService } from '../../integration/twitch/services/twitch-settings.service';
import { AucSettingsService } from '../services/auc-settings.service';
import { AucSettingsDto } from '../dto/auc-settings.dto';
import { DaSettingsService } from '../../integration/da/services/da-settings.service';

@Controller('user')
@UseGuards(new AuthGuard(UserModel))
export class UserController {
  constructor(
    private userService: UserService,
    private twitchSettingsService: TwitchSettingsService,
    private daSettingsService: DaSettingsService,
    private aucSettingsService: AucSettingsService,
  ) {}

  @Get()
  async getUser(@Session() { userId }: UserSession): Promise<GetUserDto> {
    return this.userService.getUserData(userId);
  }

  @Put('settings/integration')
  async setTwitchSettings(
    @Body() { twitch, da }: IntegrationSettingsDto,
    @Session() { userId }: UserSession,
  ): Promise<void> {
    await Promise.all([
      twitch && this.twitchSettingsService.update(userId, twitch),
      da && this.daSettingsService.update(userId, da),
    ]);
  }

  @Put('settings/auc')
  async setAucSettings(
    @Body() body: Partial<AucSettingsDto>,
    @Session() { userId }: UserSession,
  ): Promise<void> {
    await this.aucSettingsService.update(userId, body);
  }
}
