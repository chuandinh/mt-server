// src/files/files.controller.ts
import { Controller, Get, Post, UploadedFile, UseInterceptors, UploadedFiles, Param } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('files/:id?')
  async getDirectory(@Param('id') id: string = '') {
    return this.filesService.getFiles(id);
  }

  @Post('upload/:id?')
  @UseInterceptors(FileInterceptor('upload'))
  async uploadFile(@UploadedFile() file, @Param('id') id: string = '') {
    return this.filesService.uploadFile(file, id);
  }
}

