import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './user/models/user.model';
import { AucSettingsModel } from './user/models/auc-settings.model';
import { TwitchSettingsModel } from './integration/twitch/models/twitch-settings.model';
import { TwitchAuthDataModel } from './integration/twitch/models/twitch-auth-data.model';
import { TwitchModule } from './integration/twitch/twitch.module';
import { TwitchRewardPresetModel } from './integration/twitch/models/twitch-reward-preset.model';
import { DaModule } from './integration/da/da.module';
import { DaAuthModel } from './integration/da/models/da-auth.model';
import { DaSettingsModel } from './integration/da/models/da-settings.model';
import { SessionValidationMiddleware } from './core/middlewares/session-validation.middleware';
import { ConfigModule } from '@nestjs/config';
import { SettingsRestoreModule } from './old-settings-restore/settings-restore.module';
import { UserApiModule } from './user/user-api.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.development.env' }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: process.env.DB_PASSWORD,
      database: 'pointauc',
      models: [
        UserModel,
        AucSettingsModel,
        TwitchSettingsModel,
        TwitchAuthDataModel,
        TwitchRewardPresetModel,
        DaSettingsModel,
        DaAuthModel,
      ],
      autoLoadModels: true,
      logging: false,
    }),
    SequelizeModule.forFeature([UserModel]),
    UserApiModule,
    TwitchModule,
    DaModule,
    SettingsRestoreModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(SessionValidationMiddleware).forRoutes('*');
  }
}
