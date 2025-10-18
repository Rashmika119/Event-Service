import { Body, Controller, Delete, Get, InternalServerErrorException, Logger, Param, Post, Put, Query } from '@nestjs/common';
import { EventService } from './event.service';
import type { eventSearchDto } from './eventSearch.dto';
import type { eventUpdateDto } from './eventUpdate.dto';

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
      throw error
    }

  }
  @Get('/:id')
  async getEventById(@Param('id') id: string) {
    this.logger.log(`GET /event/${id} called`);
    try {
      return this.eventService.getEventById(id);
    } catch (error) {
      this.logger.error(`Error fetching event with id ${id}`, error.stack);
      throw error;

    }

  }

  @Post()
  async createEvent(
    @Body('name') name: string,
    @Body('location') location: string,
    @Body('category') category: string,
    @Body('date') date: Date,

  ) {
    this.logger.log(`POST /event called to create event: ${name} at ${location} on ${date}`);
    try {
      return this.eventService.createEvent(name, location, category, date)
    } catch (error) {
      this.logger.error('Error creating event', error.stack);
      throw error;
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
      throw error

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
      throw error;

    }

  }

}
