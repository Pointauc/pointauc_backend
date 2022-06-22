import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { AucSettingsModel } from './auc-settings.model';
import { TwitchSettingsModel } from '../../integration/twitch/models/twitch-settings.model';
import { TwitchAuthDataModel } from '../../integration/twitch/models/twitch-auth-data.model';
import { DaSettingsModel } from '../../integration/da/models/da-settings.model';
import { DaAuthModel } from '../../integration/da/models/da-auth.model';

@Table({
  createdAt: false,
  updatedAt: false,
  tableName: 'users',
})
export class UserModel extends Model<UserModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  userId: number;

  @ForeignKey(() => TwitchAuthDataModel) @Column twitchAuthId: string;
  @ForeignKey(() => DaAuthModel) @Column daAuthId: string;

  @HasOne(() => AucSettingsModel)
  aucSettings: AucSettingsModel;

  @HasOne(() => TwitchSettingsModel)
  twitchSettings: TwitchSettingsModel;

  @BelongsTo(() => TwitchAuthDataModel, 'twitchAuthId')
  twitchAuth: TwitchAuthDataModel;

  @HasOne(() => DaSettingsModel)
  daSettings: DaSettingsModel;

  @BelongsTo(() => DaAuthModel, 'daAuthId')
  daAuth: DaAuthModel;
}
