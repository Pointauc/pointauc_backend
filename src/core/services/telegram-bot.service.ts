import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramBotService {
  private bot?: Telegraf<any>;

  constructor(private configService: ConfigService) {
    this.connect();
  }

  connect = async (): Promise<void> => {
    if (!this.configService.get('IS_PRODUCTION')) {
      return;
    }

    this.bot = new Telegraf(this.configService.get('TELEGRAM_BOT_TOKEN'));
    await this.bot.launch();
  };

  logConnectedUser = async (username: string): Promise<void> => {
    await this.bot?.telegram.sendMessage('271681299', `connect ${username}`);
  };
}
