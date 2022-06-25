import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { AbstractOauthTokenModel } from '../../abstract/models/abstract-oauth-token.model';
import { TwitchSettingsModel } from './twitch-settings.model';

@Table({
  createdAt: false,
  updatedAt: false,
  tableName: 'twitch_auth_data',
  defaultScope: { attributes: { exclude: ['userId'] } },
})
export class TwitchAuthDataModel extends AbstractOauthTokenModel {
  @Column(DataType.JSON) scope: string[];
  @Column tokenType: string;

  @BelongsTo(() => TwitchSettingsModel, 'userId')
  settings?: TwitchSettingsModel;
}
