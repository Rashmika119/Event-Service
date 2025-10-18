import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Event } from './event.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { eventSearchDto } from './eventSearch.dto';
import { eventUpdateDto } from './eventUpdate.dto';


@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) { }

  async getAllEvents(): Promise<Event[]> {
    this.logger.log("fetch all events")
    return await this.eventRepo.find();
  }

  async createEvent(
    name: string,
    location: string,
    category: string,
    date: Date,
  ): Promise<Event> {
    this.logger.log(`creating new event name :${name}`)
    const event = this.eventRepo.create({
      name,
      location,
      category,
      date
    });
    await this.eventRepo.save(event);
    this.logger.debug(`event created with id :${event.id}`)
    return event;
  }


  async deleteEvent(id: string): Promise<void> {
    const result = await this.eventRepo.delete(id);
    this.logger.log(`Attempting to delete the event with id :${id}`)

    if (result.affected === 0) {
      this.logger.error(`deleting event failed.Event with ${id} not found`)
      throw new NotFoundException(`Event with is ${id} not found`)
    }
    this.logger.log(`deleted event with id :${id} successfully`)

  }


  async eventSearch(eventSearchDto: eventSearchDto): Promise<Event[]> {
    const { name, location, date, category } = eventSearchDto;
    this.logger.log("fetching event datat according to the filters")
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
    const events= await query.getMany();
    this.logger.log(`Search returned ${events.length} result(s)`);
    return events;

  }
  async getEventById(id: string): Promise<Event> {
    
    const event = await this.eventRepo.findOne({ where: { id } })
    if (!event) {
      this.logger.error(`Event with ID ${id} not found`);
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async updateEvent(id: string, eventUpdatedto: eventUpdateDto): Promise<Event> {
    this.logger.log(`Updating event with ID: ${id}`);
    const event = await this.getEventById(id);
    Object.assign(event, eventUpdatedto);

    const updatedEvent= await this.eventRepo.save(event);
    this.logger.log(`Event with ID ${id} updated successfully`);
    return updatedEvent;

  }
}
