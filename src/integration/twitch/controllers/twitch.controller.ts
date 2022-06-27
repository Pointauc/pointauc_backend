import { Body, Controller, Post, Session } from '@nestjs/common';
import { TwitchAuthService } from '../services/twitch-auth.service';
import { UserSession } from '../../../user/dto/user.dto';
import { UserService } from '../../../user/services/user.service';
import { filter, first } from 'rxjs';

@Controller('twitch')
export class TwitchController {
  constructor(
    private twitchAuthService: TwitchAuthService,
    private userService: UserService,
  ) {}

  @Post('auth')
  async authorize(
    @Body('code') code: string,
    @Session() session: UserSession,
  ): Promise<{ isNew: boolean }> {
    let isNew = false;
    const nonce = Math.random().toString();
    const subscription = this.userService.$userCreated
      .pipe(
        filter((data) => data === nonce),
        first(),
      )
      .subscribe(() => {
        isNew = true;
      });

    session.userId = await this.twitchAuthService.authorize(
      { code },
      session.userId,
      nonce,
    );
    subscription.unsubscribe();

    return { isNew };
  }
}
