import { Column, Table } from 'sequelize-typescript';
import { AbstractOauthTokenModel } from '../../abstract/models/abstract-oauth-token.model';

@Table({
  createdAt: false,
  updatedAt: false,
  tableName: 'da_auth_data',
  defaultScope: { attributes: { exclude: ['userId'] } },
})
export class DaAuthModel extends AbstractOauthTokenModel {
  @Column socketConnectionToken: string;
}
