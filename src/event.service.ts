import { HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Event } from './Entity/event.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { eventSearchDto } from './DTO/eventSearch.dto';
import { eventUpdateDto } from './DTO/eventUpdate.dto';


@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) { }

  async getAllEvents(): Promise<Event[]> {
    try {
      this.logger.log("fetch all events")
      return await this.eventRepo.find();
    } catch (error) {
      this.logger.error(`Error of fetching hotels`, error.stack);
      throw new InternalServerErrorException('Failed to fetch hotels')
    }
  }

  async createEvent(
    name: string,
    location: string,
    category: string,
    date: Date,
  ): Promise<Event> {
    this.logger.log(`creating new event name :${name}`)
    try {
      const event = this.eventRepo.create({
        name,
        location,
        category,
        date
      });
      await this.eventRepo.save(event);
      this.logger.debug(`event created with id :${event.id}`)
      return event;
    } catch (error) {
      this.logger.error(`Error of creating event with`);
      throw new InternalServerErrorException("Failed to create the event");
    }
  }


  async deleteEvent(id: string): Promise<void> {
    try {
      const result = await this.eventRepo.delete(id);
      this.logger.log(`Attempting to delete the event with id :${id}`)

      if (result.affected === 0) {
        this.logger.error(`deleting event failed.Event with ${id} not found`)
        throw new NotFoundException(`Event with is ${id} not found`)
      }
      this.logger.log(`deleted event with id :${id} successfully`)
    } catch (error) {
      this.logger.error("error of deleteing event with id :",id);
      throw new InternalServerErrorException("failed to delete the event");
    }
  }

  async eventSearch(eventSearchDto: eventSearchDto): Promise<Event[]> {
    const { name, location, date, category } = eventSearchDto;
    this.logger.log("fetching event datat according to the filters")
    try {
      const query = this.eventRepo.createQueryBuilder('event')

      if (name) {
        this.logger.debug(`Filtering event by name : ${name}`)
        query.andWhere('event.name LIKE :name', {
          name: `%${name}%`,
        })
      }

      if (category) {
        this.logger.debug(`Filtering event by category : ${category}`)
        query.andWhere('event.category LIKE :category', {
          category: `%${category}%`,
        })
      }
      if (date) {
        this.logger.debug(`Filtering event by date : ${date}`)
        query.andWhere('event.date LIKE :date', {
          date: `%${date}%`,
        })
      }
      if (location) {
        this.logger.debug(`Filtering event by location : ${location}`)
        query.andWhere('event.location LIKE :location', {
          location: `%${location}%`,
        })
      }
      const events = await query.getMany();
      this.logger.log(`Search returned ${events.length} result(s)`);
      return events;
    } catch (error) {
      this.logger.error("error of searching event")
      throw new InternalServerErrorException("failed to search event")
    }
  }

  async getEventById(id: string): Promise<Event> {
    try {
      const event = await this.eventRepo.findOne({ where: { id } })
      if (!event) {
        this.logger.error(`Event with ID ${id} not found`);
        throw new NotFoundException(`Event with ID ${id} not found`);
      }
      return event;
    } catch (error) {
      this.logger.error(`Error fetching event with id ${id}`, error.stack);
      throw new InternalServerErrorException("failed to get the event by id");

    }
  }

  async updateEvent(id: string, eventUpdatedto: eventUpdateDto): Promise<Event> {
    this.logger.log(`Updating event with ID: ${id}`);
    try {
      const event = await this.getEventById(id);
      Object.assign(event, eventUpdatedto);

      const updatedEvent = await this.eventRepo.save(event);
      this.logger.log(`Event with ID ${id} updated successfully`);
      return updatedEvent;
    } catch (error) {
      this.logger.error('Error creating event', error.stack);
      throw new InternalServerErrorException("failed to update the event");
    }

  }
}
