// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as cookieSession from 'cookie-session';

export const userCookieSession = cookieSession({
  name: 'userSession',
  secret: 'secret:dev',
  httpOnly: false,
});
