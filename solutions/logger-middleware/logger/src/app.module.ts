import { Module , MiddlewareConsumer, NestModule} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import logMiddleware from './middlewares/logger';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logMiddleware).forRoutes("*");
  }
}
