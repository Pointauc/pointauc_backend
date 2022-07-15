import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { TwitchAuthService } from '../services/twitch-auth.service';
import { UserSession } from '../../../user/dto/user.dto';
import { UserService } from '../../../user/services/user.service';
import { filter, first } from 'rxjs';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../../../user/models/user.model';
import { TwitchAuthDataModel } from '../models/twitch-auth-data.model';
import { TwitchRewardsService } from '../services/twitch-rewards.service';
import { PatchRedemptionDto } from '../dto/twitch-redemption.dto';
import { AuthGuard } from '../../../core/guards/auth.guard';

@Controller('twitch')
export class TwitchController {
  constructor(
    @InjectModel(UserModel) private user: typeof UserModel,
    private twitchAuthService: TwitchAuthService,
    private userService: UserService,
    private twitchRewardsService: TwitchRewardsService,
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

  @UseGuards(new AuthGuard(UserModel))
  @Delete('rewards')
  async deleteRewards(@Session() { userId }: UserSession) {
    const {
      twitchAuth: { id, accessToken },
    } = await this.user.findByPk(userId, { include: [TwitchAuthDataModel] });

    await this.twitchRewardsService.closeRewards(accessToken, id);
  }

  @UseGuards(new AuthGuard(UserModel))
  @Patch('redemptions')
  async updateRedemption(
    @Session() { userId }: UserSession,
    @Body() data: PatchRedemptionDto,
  ) {
    const {
      twitchAuth: { id, accessToken },
    } = await this.user.findByPk(userId, { include: [TwitchAuthDataModel] });

    await this.twitchRewardsService.setRedemptionStatus(accessToken, id, data);
  }
}
