import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AcknowledgeAlarmCommnad } from './acknowledge-alarm.command';
import { Logger } from '@nestjs/common';
import { AggregateRehydrator } from 'src/shared/application/ports/aggregate-rehydrator';
import { Alarm } from 'src/alarms/domain/alarm';

@CommandHandler(AcknowledgeAlarmCommnad)
export class AcknowledgeAlarmCommnadHandler
  implements ICommandHandler<AcknowledgeAlarmCommnad>
{
  private readonly logger = new Logger(AcknowledgeAlarmCommnadHandler.name);

  constructor(private readonly aggregateRehydrator: AggregateRehydrator) {}

  async execute(command: AcknowledgeAlarmCommnad) {
    this.logger.debug(
      `Proccesing "AcknowledgeAlarmCommand": ${JSON.stringify(command)}`,
    );

    const alarm = await this.aggregateRehydrator.rehydrate(
      command.alarmId,
      Alarm,
    );

    alarm.acknowledge();
    alarm.commit();
    return alarm;
  }
}
