import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../../user/models/user.model';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@InjectModel(UserModel) private userModel: typeof UserModel) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const userId = context.switchToHttp().getRequest().session?.userId;

    return !!userId;
  }
}
