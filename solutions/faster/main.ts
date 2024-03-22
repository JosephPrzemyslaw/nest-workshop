
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  let app;
  if (process.env.WEB_FRAMEWORK === "fastify") {
    app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter
    );
  } else {
    app = await NestFactory.create(AppModule);
  }
  await app.listen(3000);
}
bootstrap();
