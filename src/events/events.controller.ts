// event.controller.ts
import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from '../models/event.model'

@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Get()
  async getEvents(): Promise<Event[]> {
    return this.eventService.getEvents();
  }

  @Get(':id')
  getEventData(@Param('id') id: string) {
    const filePath = `./data/${id}.json`; // Adjust the path as needed
    return this.eventService.getEvent(id);
  }

  @Put(':id')
  updateEventData(@Param('id') id: string, @Body() data: any) {

    this.eventService.saveEvent(id, data);

    // May need to generate new event id, song ids, media ids before sending back to the client
    return data;
  } 
}
