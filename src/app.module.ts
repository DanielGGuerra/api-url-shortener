import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UrlModule } from './modules/url/url.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, UrlModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new TransformInterceptor(),
    },
  ],
})
export class AppModule {}
