import {
  AutoIncrement,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { UserModel } from '../../../user/models/user.model';

@Table({
  createdAt: false,
  updatedAt: false,
  tableName: 'twitch_reward_preset',
  // defaultScope: { attributes: { exclude: ['userId'] } },
})
export class TwitchRewardPresetModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => UserModel)
  @Unique(false)
  @Column
  userId: number;

  @Column cost: number;
  @Column color: string;
}
