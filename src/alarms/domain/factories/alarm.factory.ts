import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AlarmSeverity } from '../value-objects/alarm-seveirty';
import { Alarm } from '../alarm';

@Injectable()
export class AlarmFactory {
  create(name: string, seveirty: string) {
    const alarmId = randomUUID();
    const alarmSeverity = new AlarmSeverity(seveirty as AlarmSeverity['value']);
    return new Alarm(alarmId,name,alarmSeverity)
  }
}
