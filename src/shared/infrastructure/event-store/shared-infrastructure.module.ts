import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './schemas/event.schema';
import { EVENT_STORE_CONNECTION } from 'src/core/core.constants';
import { EventSerializer } from './serializers/event.serializer';
import { EventStorePublisher } from './publishers/event-store.publisher';
import { MongoEventStore } from './mongo-event-store';
import { EventDeserializer } from './deserializers/event.deserializer';
import { EventsBrigde } from './events-bridge';
import { EventStore } from 'src/shared/application/ports/event-store';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Event.name, schema: EventSchema }],
      EVENT_STORE_CONNECTION,
    ),
  ],
  providers: [
    EventSerializer,
    EventStorePublisher,
    MongoEventStore,
    EventDeserializer,
    EventsBrigde,
    {
      provide: EventStore,
      useExisting: MongoEventStore,
    },
  ],
  exports: [EventStore],
})
export class SharedInfrastructureModule {}
