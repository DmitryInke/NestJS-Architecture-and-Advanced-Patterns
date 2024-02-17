export class CreateAlarmDto {
  readonly name: string;
  readonly severity: string;
  readonly triggeredAt: Date;
  readonly items: Array<{
    name: string;
    type: string;
  }>;
}
