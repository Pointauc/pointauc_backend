import {
  Column,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { UserModel } from '../../../user/models/user.model';

@Table({
  createdAt: false,
  updatedAt: false,
  tableName: 'da_settings',
  defaultScope: { attributes: { exclude: ['userId'] } },
})
export class DaSettingsModel extends Model {
  @PrimaryKey
  @ForeignKey(() => UserModel)
  @Column
  userId: number;

  @Default(100) @Column pointsRate: number;
  @Default(false) @Column isIncrementActive: boolean;
  @Default(60) @Column incrementTime: number;
}
