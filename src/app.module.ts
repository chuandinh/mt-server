import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { FilesModule } from './files/files.module';
import { MulterModule } from '@nestjs/platform-express';

import { EventsController } from './events/events.controller';
import { EventsService } from './events/events.service';

import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Upload directory
    }),
    FilesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'temp'), // Change this path based on your project structure
      serveRoot: '/temp',
    })   
  ],
  controllers: [AppController, EventsController],
  providers: [AppService, EventsService],
})
export class AppModule {}
