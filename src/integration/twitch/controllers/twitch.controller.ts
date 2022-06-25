import { Body, Controller, Post, Session } from '@nestjs/common';
import { TwitchAuthService } from '../services/twitch-auth.service';
import { UserSession } from '../../../user/dto/user.dto';

@Controller('twitch')
export class TwitchController {
  constructor(private twitchAuthService: TwitchAuthService) {}

  @Post('auth')
  async authorize(
    @Body('code') code: string,
    @Session() session: UserSession,
  ): Promise<void> {
    session.userId = await this.twitchAuthService.authorize(
      { code },
      session.userId,
    );
  }
}
