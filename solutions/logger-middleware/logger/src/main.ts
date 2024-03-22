import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import loggerMiddleware from './middlewares/logger';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter);

  app.use(loggerMiddleware);
  await app.listen(3000);
}
bootstrap();
