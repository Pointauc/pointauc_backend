import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import axios from 'axios';
import { userCookieSession } from './core/constants/userCookieSession.constants';

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
