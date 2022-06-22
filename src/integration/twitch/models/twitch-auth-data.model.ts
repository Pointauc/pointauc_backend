import { Column, DataType, Table } from 'sequelize-typescript';
import { AbstractOauthTokenModel } from '../../abstract/models/abstract-oauth-token.model';

@Table({
  createdAt: false,
  updatedAt: false,
  tableName: 'twitch_auth_data',
  defaultScope: { attributes: { exclude: ['userId'] } },
})
export class TwitchAuthDataModel extends AbstractOauthTokenModel {
  @Column(DataType.JSON) scope: string[];
  @Column tokenType: string;
}
