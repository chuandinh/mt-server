// event.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { Event } from '../models/event.model'

@Injectable()
export class EventsService {
  private readonly dataDir: string;

  constructor() {
    // Set the data directory path in the constructor
    this.dataDir = path.join(__dirname, '../../data');
  }

  async getEvents(): Promise<Event[]> {
    const files = fs.readdirSync(this.dataDir);
    const events: Event[] = [];

    files.forEach(file => {
      if (file.endsWith('.json')) {

        var eventId = file.replace(".json", "");

        if (this.isInteger(eventId)) {

          const filePath = path.join(this.dataDir, file);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const event : Event = JSON.parse(fileContent);

          // Assign id base on the file name
          event.id = this.stringToInt(eventId);

          // Empty the songs for the list
          event.songs = [];

          events.push(event);
        }
      }
    });

    return events;
  }

  getEvent(id: string): Event {
    const filePath = path.join(this.dataDir, `${id}.json`);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }

  saveEvent(id: string, data: Event): void {    
    const filePath = path.join(this.dataDir, `${id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  isInteger(str: string): boolean {
    const integerRegExp = /^[-+]?\d+$/;
    return integerRegExp.test(str);
  }
 
  stringToInt(str: string): number | null {
    const num = parseInt(str, 10);
    // Check if the result is NaN, which indicates that the string is not a valid integer
    if (isNaN(num)) {
      return null; // Return null to indicate conversion failure
    }
    return num;
  }   
}
