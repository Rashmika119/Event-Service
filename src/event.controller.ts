import { Body, Controller, Delete, Get, InternalServerErrorException, Logger, Param, Post, Put, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { eventSearchDto } from './DTO/eventSearch.dto';
import { eventUpdateDto } from './DTO/eventUpdate.dto';
import { createEventDto } from './DTO/createEvent.dto';

@Controller('event')
export class EventController {
  private readonly logger = new Logger(EventController.name)
  constructor(private readonly eventService: EventService) { }

  @Get()
  getAllEvents(@Query() param: eventSearchDto) {
    this.logger.log(`GET /event called with query: ${JSON.stringify(param)}`);
    try {
      if (Object.keys(param).length) {
        return this.eventService.eventSearch(param);
      } else {
        return this.eventService.getAllEvents();
      }
    } catch (error) {
      this.logger.error('Error fetching events', error.stack);
      throw new InternalServerErrorException('Failed to fetch events');
    }
  }
  @Get('/:id')
  async getEventById(@Param('id') id: string) {
    this.logger.log(`GET /event/${id} called`);
    try {
      return this.eventService.getEventById(id);
    } catch (error) {
      this.logger.error(`Error fetching event with id ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch event');
    }


  }

  @Post()
  async createEvent(@Body() dto: createEventDto) {
    const { name, location, category, date } = dto;
    this.logger.log(`POST /event called to create event: ${name} at ${location} on ${date}`);
    try {
      const parseDate = new Date()
      return this.eventService.createEvent(name, location, category, parseDate)
    } catch (error) {
      this.logger.error('Error creating event', error.stack);
      throw new InternalServerErrorException('Failed to create event');
    }
  }



  @Put('/:id')
  async updateEvent(
    @Param() id: string,
    @Body() updatedData: eventUpdateDto
  ) {
    this.logger.log(`PUT /event/${id} called to update event`);
    try {
      return await this.eventService.updateEvent(id, updatedData);
    } catch (error) {
      this.logger.error(`Error updating event with id ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to update event');
    }

  }

  @Delete('/:id')
  async deleteEvent(
    @Param() id: string
  ) {
    this.logger.log(`DELETE /event/${id} called`);
    try {
      await this.eventService.deleteEvent(id)
      this.logger.log(`Event with id ${id} successfully deleted`);
      return { message: 'Event deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting event with id ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to delete event');
    }

  }

}


