import {
  AllowNull,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
} from 'sequelize-typescript';
import { UserModel } from '../../../user/models/user.model';

export class AbstractOauthTokenModel extends Model<AbstractOauthTokenModel> {
  @PrimaryKey @Column id: string;

  @ForeignKey(() => UserModel)
  @AllowNull
  @Column
  userId: number;

  @Column username: string;
  @Column(DataType.TEXT) accessToken: string;
  @Column expiresIn: number;
  @Column(DataType.TEXT) refreshToken: string;
}
