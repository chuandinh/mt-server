import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { FilesModule } from './files/files.module';
import { MulterModule } from '@nestjs/platform-express';

import { EventsController } from './events/events.controller';
import { EventsService } from './events/events.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Upload directory
    }),
    FilesModule,
  ],
  controllers: [AppController, EventsController],
  providers: [AppService, EventsService],
})
export class AppModule {}
