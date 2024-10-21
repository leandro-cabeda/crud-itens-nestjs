import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ItemModule } from './item/item.module';
import { APP_PIPE } from '@nestjs/core';
import { CustomValidationPipe } from './validation/custom.validation.pipe';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        const mongod = await MongoMemoryServer.create();
        return {
          uri: mongod.getUri(),
        };
      },
    }),
    ItemModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe, // Registre o CustomValidationPipe como um Pipe global
    },
  ],
})
export class AppModule {}
