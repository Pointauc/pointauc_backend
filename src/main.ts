import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import axios from 'axios';
import { userCookieSession } from './core/constants/userCookieSession.constants';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (!global.XMLHttpRequest) global.XMLHttpRequest = require('xhr2');
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (!global.WebSocket) global.WebSocket = require('ws');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(userCookieSession);

  app.setGlobalPrefix('api');

  axios.interceptors.response.use(undefined, (error) => {
    console.log(error.response);

    return Promise.reject(error);
  });

  await app.listen(8000);
}
bootstrap();
