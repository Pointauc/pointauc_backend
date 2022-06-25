import { IOauthUserData } from '../../abstract/dto/abstract-oauth.dto';

export interface DaUserData extends IOauthUserData {
  socketConnectionToken: string;
}
