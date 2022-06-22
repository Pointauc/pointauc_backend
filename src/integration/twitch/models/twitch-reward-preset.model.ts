import {
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { UserModel } from '../../../user/models/user.model';

@Table({
  createdAt: false,
  updatedAt: false,
  tableName: 'twitch_reward_preset',
  defaultScope: { attributes: { exclude: ['userId'] } },
})
export class TwitchRewardPresetModel extends Model {
  @PrimaryKey
  @ForeignKey(() => UserModel)
  @Column
  userId: number;

  @Column cost: number;
  @Column color: string;
}
