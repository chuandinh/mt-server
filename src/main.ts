import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.use(cors());

  /*
  app.use(cors({
    origin: 'http://localhost:4200', // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials like cookies to be sent
  }));
  */ 

  // Serve Angular static files
  app.use(express.static(path.join(__dirname, '..', 'client')));

  await app.listen(3000);
}
bootstrap();
