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
    var event: Event = JSON.parse(data);

    // convert to YYYY/MM/DD
    event.date = this.formatDate(event.date);

    return event;
  }

  saveEvent(id: string, data: Event): void {    

    // convert back to YYYYMMDD
    data.date = this.formatJsonDate(data.date);

    const filePath = path.join(this.dataDir, `${id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }


  deleteEvent(id: string): Event {
    const filePath = path.join(this.dataDir, `${id}.json`);
    const data = fs.readFileSync(filePath, 'utf-8');
    var event: Event = JSON.parse(data);

    // convert to YYYY/MM/DD
    event.date = this.formatDate(event.date);

    // Delete the file
    fs.rmSync(filePath);

    return event;
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

  // To convert a date from the format YYYYDDMM to YYYY/DD/MM
  formatDate(dateString: string): string {
    if (dateString.includes("/")) return dateString;

    // Extract the year, day, and month components
    const year: string = dateString.substring(0, 4);
    const day: string = dateString.substring(4, 6);
    const month: string = dateString.substring(6, 8);
    
    // Concatenate the components with the appropriate separators
    const convertedDate: string = `${year}/${day}/${month}`;
    
    return convertedDate;
  }

  // To convert a date from the format YYYY/MM/DD to YYYYMMDD
  formatJsonDate(dateString: string): string {
    if (dateString.includes("/") == false) return dateString;

    // Split the date string into year, month, and day components
    const [year, month, day] = dateString.split('/');

    // Concatenate the components together without any separators
    const convertedDate: string = `${year}${month}${day}`;
    
    return convertedDate;
  }
}
