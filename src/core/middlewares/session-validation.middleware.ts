import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../../user/models/user.model';

@Injectable()
export class SessionValidationMiddleware implements NestMiddleware {
  constructor(@InjectModel(UserModel) private userModel: typeof UserModel) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    if (req.session?.userId) {
      const user = await this.userModel.findByPk(req.session.userId);

      if (!user) {
        req.session = null;
      }
    }

    next();
  }
}
