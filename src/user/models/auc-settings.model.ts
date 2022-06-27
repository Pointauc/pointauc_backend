import {
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';
import { UserModel } from './user.model';

@Table({
  createdAt: false,
  updatedAt: false,
  tableName: 'auc_settings',
  defaultScope: { attributes: { exclude: ['userId'] } },
})
export class AucSettingsModel extends Model {
  @ForeignKey(() => UserModel)
  @Unique
  @Column
  userId: number;

  @Default(10) @Column startTime: number;
  @Default(60) @Column timeStep: number;
  @Default(false) @Column isAutoincrementActive: boolean;
  @Default(30) @Column autoincrementTime: number;
  @Default(true) @Column isBuyoutVisible: boolean;
  @Default(null) @Column(DataType.TEXT('long')) background: string;
  @Default(0) @Column purchaseSort: number;
  @Default(false) @Column marblesAuc: boolean;
  @Default(50) @Column marbleRate: number;
  @Default(100) @Column marbleCategory: number;
  @Default(false) @Column isMaxTimeActive: boolean;
  @Default(15) @Column maxTime: number;
  @Default(false) @Column isNewSlotIncrement: boolean;
  @Default(60) @Column newSlotIncrement: number;
  @Default(false) @Column showChances: boolean;
  @Default(true) @Column isTotalVisible: boolean;
}
