import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import axios from 'axios';
import { userCookieSession } from './core/constants/userCookieSession.constants';
import { LoggingInterceptor } from './core/services/logging.interceptor';
import { HttpException } from '@nestjs/common';
import * as bodyParser from 'body-parser';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (!global.XMLHttpRequest) global.XMLHttpRequest = require('xhr2');
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (!global.WebSocket) global.WebSocket = require('ws');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: '*' } });

  app.useGlobalInterceptors(new LoggingInterceptor());

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(userCookieSession);

  app.setGlobalPrefix('api');

  axios.interceptors.response.use(undefined, (error) => {
    console.log(error.response.data);
    console.log(error.response.config.url);

    throw new HttpException(error.response.data, error.response.status);
  });

  await app.listen(8000);
}
bootstrap();
