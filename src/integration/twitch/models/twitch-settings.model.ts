import {
  Column,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { UserModel } from '../../../user/models/user.model';
import { TwitchRewardPresetModel } from './twitch-reward-preset.model';

@Table({
  createdAt: false,
  updatedAt: false,
  tableName: 'twitch_settings',
  defaultScope: { attributes: { exclude: ['userId'] } },
})
export class TwitchSettingsModel extends Model {
  @PrimaryKey
  @ForeignKey(() => UserModel)
  @Column
  userId: number;

  @Default(false) @Column isRefundAvailable: boolean;
  @Default(false) @Column dynamicRewards: boolean;
  @Default('Ставка') @Column rewardsPrefix: string;

  @HasMany(() => TwitchRewardPresetModel, 'userId')
  rewardPresets: TwitchRewardPresetModel[];
}
