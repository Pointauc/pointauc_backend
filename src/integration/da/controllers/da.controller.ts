import { Body, Controller, Post, Session } from '@nestjs/common';
import { DaAuthService } from '../services/da-auth.service';
import { UserSession } from '../../../user/dto/user.dto';

interface IAuthBody {
  code: string;
  redirect_uri: string;
}

@Controller('da')
export class DaController {
  constructor(private daAuthService: DaAuthService) {}

  @Post('auth')
  async authorize(
    @Body() body: IAuthBody,
    @Session() session: UserSession,
  ): Promise<void> {
    session.userId = await this.daAuthService.authorize(body, session.userId);
  }
}
