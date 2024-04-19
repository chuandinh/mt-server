// event.controller.ts
import { Controller, Get, Put, Delete, Body, Param, Res } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from '../models/event.model'

import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import * as AdmZip from 'adm-zip';

@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Get()
  async getEvents(): Promise<Event[]> {
    return this.eventService.getEvents();
  }

  @Get(':id')
  getEvent(@Param('id') id: string) {

    return this.eventService.getEvent(id);
  }

  @Put(':id')
  updateEvent(@Param('id') id: string, @Body() data: any) {

    this.eventService.saveEvent(id, data);

    // May need to generate new event id, song ids, media ids before sending back to the client
    return data;
  } 

  @Delete(':id')
  deleteEvent(@Param('id') id: string) {
    return this.eventService.deleteEvent(id);
  }

  @Get('yaml/:id')
  yaml(@Param('id') id: string) {

    const jsonData = this.eventService.getEvent(id);

    // Convert JSON to YAML format
    const yamlData = yaml.dump({
      event: {
        id: jsonData.id,
        name: jsonData.name,
        date: jsonData.date,
        time: jsonData.time,
        type: jsonData.type
      },
      songs: jsonData.songs.map(song => ({
        name: song.sName,
        part: song.cName,
        pdfName: song.pdf.link,
        medias: song.medias.map(media => media.link)
      }))
    });

    return yamlData;
  }

  @Get('generate/:id')
  generate(@Param('id') id: string) {

    const event = this.eventService.getEvent(id);

    // Source folder 
    const sourceFolderRoot = path.join(__dirname, '../../uploads');

    // Create output folder
    const outputFolderRoot = path.join(__dirname, '../../temp');
    if (!fs.existsSync(outputFolderRoot)) {
      fs.mkdirSync(outputFolderRoot);
    }    

    // Clean and create output folder
    const outputFolderPath = path.join(outputFolderRoot, event.date.replaceAll("/", ""));
    if (fs.existsSync(outputFolderPath)) {
      fs.readdirSync(outputFolderPath).forEach(file => {
        const filePath = path.join(outputFolderPath, file);
        fs.unlinkSync(filePath);
      });
    } else {
      fs.mkdirSync(outputFolderPath);
    }

    // Copy PDF files and generate YAML data
    const yamlData = {
      event: {
        id: event.id,
        name: event.name,
        date: event.date,
        time: event.time,
        type: event.type,
      },
      songs: event.songs.map(song => {
        // Copy pdf file
        const sourcePdfPath = path.join(sourceFolderRoot, song.pdf.link);
        const destinationPdfPath = path.join(outputFolderPath, song.pdf.link);

        if (fs.existsSync(sourcePdfPath)) {
          fs.copyFileSync(sourcePdfPath, destinationPdfPath);
        }

        // Copy media files
        const mediaFiles: string[] = [];
        song.medias.forEach(media => {
          
          const sourceMediaPath = path.join(sourceFolderRoot, media.link);
          const destinationMediaPath = path.join(outputFolderPath, media.link);

          if (fs.existsSync(sourceMediaPath)) {
            fs.copyFileSync(sourceMediaPath, destinationMediaPath);
          }

          mediaFiles.push(media.link);
        });

        return {
          name: song.sName,
          part: song.cName,
          pdfName: song.pdf.name,
          medias: mediaFiles,
        };
      }),
    };

    if (event.type == "Weekly Mass") {
      // Write weekly.yaml
      const weeklyYamlPath = path.join(outputFolderPath, 'weekly.yaml');
      fs.writeFileSync(weeklyYamlPath, yaml.dump(yamlData));
    } else {
      // Write other.yaml
      const weeklyYamlPath = path.join(outputFolderPath, 'other.yaml');
      fs.writeFileSync(weeklyYamlPath, yaml.dump(yamlData));
    }

    // Create zip file
    const zip = new AdmZip();
    zip.addLocalFolder(outputFolderPath);

    // Generate a unique filename for the zip file
    const zipFilename = `${event.date.replaceAll("/","")}.zip`;
    const zipFilePath = path.join(outputFolderRoot, zipFilename);
    zip.writeZip(zipFilePath);

    return zipFilename;
  }
}
