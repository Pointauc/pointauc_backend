import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from '../../user/user.module';
import { DaController } from './controllers/da.controller';
import { DaAuthService } from './services/da-auth.service';
import { DaAuthModel } from './models/da-auth.model';
import { UserModel } from '../../user/models/user.model';
import { ConfigModule } from '@nestjs/config';
import { DaBidsGateway } from './services/da-bids.gateway';

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel, DaAuthModel]),
    UserModule,
    ConfigModule,
  ],
  providers: [DaAuthService, DaBidsGateway],
  controllers: [DaController],
  exports: [DaAuthService],
})
export class DaModule {}
