import { Module } from '@nestjs/common';
import { OrmAlarmPersistanceModule } from './orm/orm-persistence.module';
import { InMemoryAlarmPersistanceModule } from './in-memory/in-memory-persistence.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  exports: [SharedModule],
})
export class AlarmsInfrastructureModule {
  static use(driver: 'orm' | 'in-memory') {
    const persistenceModule =
      driver === 'orm'
        ? OrmAlarmPersistanceModule
        : InMemoryAlarmPersistanceModule;

    return {
      module: AlarmsInfrastructureModule,
      imports: [persistenceModule],
      exports: [persistenceModule],
    };
  }
}
