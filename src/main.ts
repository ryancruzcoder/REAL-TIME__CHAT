import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'
import * as express from 'express'
import * as path from 'path'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(express.json())
  app.use(express.urlencoded({ extended: true}))
  app.use(cookieParser())
  app.useStaticAssets(path.resolve(__dirname, '..', 'public', 'assets'))
  app.setViewEngine('ejs')
  app.setBaseViewsDir(path.resolve(__dirname, '..', 'public', 'views'))

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
