import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { EVENT_STORE_CONNECTION } from 'src/core/core.constants';
import { EventBus } from '@nestjs/cqrs';
import { Model } from 'mongoose';
import { ChangeStream, ChangeStreamInsertDocument } from 'mongodb';
import { EventDeserializer } from './deserializers/event.deserializer';

@Injectable()
export class EventsBrigde
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private changeStream: ChangeStream;

  constructor(
    @InjectModel(Event.name, EVENT_STORE_CONNECTION)
    private readonly eventStore: Model<Event>,
    private readonly eventBus: EventBus,
    private readonly eventDeserializer: EventDeserializer,
  ) {}

  onApplicationBootstrap() {
    this.changeStream = this.eventStore.watch() as unknown as ChangeStream;
    this.changeStream.on(
      'change',
      (change: ChangeStreamInsertDocument<EventDocument>) => {
        if (change.operationType === 'insert') {
          this.handleEventStoreChange(change);
        }
      },
    );
  }

  onApplicationShutdown() {
    return this.changeStream.close();
  }

  handleEventStoreChange(change: ChangeStreamInsertDocument<EventDocument>) {
    const insertedEvent = change.fullDocument;

    const eventInstance = this.eventDeserializer.deserializer(insertedEvent);
    this.eventBus.subject$.next(eventInstance.data);
  }
}
