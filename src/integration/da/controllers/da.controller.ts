import { Body, Controller, Post, Session } from '@nestjs/common';
import { DaAuthService } from '../services/da-auth.service';
import { UserSession } from '../../../user/dto/user.dto';
import { filter, first } from 'rxjs';
import { UserService } from '../../../user/services/user.service';

interface IAuthBody {
  code: string;
  redirect_uri: string;
}

@Controller('da')
export class DaController {
  constructor(
    private daAuthService: DaAuthService,
    private userService: UserService,
  ) {}

  @Post('auth')
  async authorize(
    @Body() body: IAuthBody,
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

    session.userId = await this.daAuthService.authorize(
      body,
      session.userId,
      nonce,
    );

    subscription.unsubscribe();

    return { isNew };
  }
}
