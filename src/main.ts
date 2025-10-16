import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.enableCors({
    methods: ['POST', 'GET', 'PATCH', 'DELETE'],
    origin: configService.getOrThrow<string>('ORIGIN_URL'),
    credentials: true,
  });

  await app.listen(configService.getOrThrow<number>('PORT'));
}
bootstrap().catch((e) => console.log(e));
