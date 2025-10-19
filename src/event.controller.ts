import { Body, Controller, Delete, Get, InternalServerErrorException, Logger, Param, Post, Put, Query } from '@nestjs/common';
import { EventService } from './event.service';
import type { eventSearchDto } from './DTO/eventSearch.dto';
import type { eventUpdateDto } from './DTO/eventUpdate.dto';
import { createEventDto } from './DTO/createEvent.dto';

@Controller('event')
export class EventController {
  private readonly logger = new Logger(EventController.name)
  constructor(private readonly eventService: EventService) { }

  @Get()
  getAllEvents(@Query() param: eventSearchDto) {
    this.logger.log(`GET /event called with query: ${JSON.stringify(param)}`);
    if (Object.keys(param).length) {
      return this.eventService.eventSearch(param);
    } else {
      return this.eventService.getAllEvents();
    }


  }
  @Get('/:id')
  async getEventById(@Param('id') id: string) {
    this.logger.log(`GET /event/${id} called`);
    return this.eventService.getEventById(id);


  }

  @Post()
  async createEvent(@Body() dto:createEventDto) {
    const {name,location,category,date}=dto;
    this.logger.log(`POST /event called to create event: ${name} at ${location} on ${date}`);
    const parseDate=new Date()
    return this.eventService.createEvent(name, location, category, parseDate)
  }



  @Put('/:id')
  async updateEvent(
    @Param() id: string,
    @Body() updatedData: eventUpdateDto
  ) {
    this.logger.log(`PUT /event/${id} called to update event`);
    return await this.eventService.updateEvent(id, updatedData);


  }

  @Delete('/:id')
  async deleteEvent(
    @Param() id: string
  ) {
    this.logger.log(`DELETE /event/${id} called`);
    await this.eventService.deleteEvent(id)
    this.logger.log(`Event with id ${id} successfully deleted`);
    return { message: 'Event deleted successfully' };

  }

}


