import { col, fn } from 'sequelize';

export class SequelizeUtils {
  static toBoolean(field: string) {
    return fn('IF', fn('ISNULL', col(field)), false, true);
  }
}
