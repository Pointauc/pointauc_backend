export interface IAppCredentials {
  clientId: string;
  clientSecret: string;
  redirectUri?: string;
}

export interface IOauthTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

export interface IOauthToken {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

export interface IOauthUserData {
  username: string;
  id: string;
}

export type AuthDataDto<TokenType = IOauthToken> = TokenType &
  IOauthUserData & { userId?: number };
