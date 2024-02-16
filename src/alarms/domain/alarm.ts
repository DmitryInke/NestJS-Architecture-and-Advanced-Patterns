import { AlarmSeverity } from './value-objects/alarm-seveirty';

export class Alarm {
  constructor(
    public id: string,
    public name: string,
    public severity: AlarmSeverity,
  ) {}
}
