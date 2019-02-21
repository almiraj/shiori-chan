import { ScheduleRow } from './schedule-row';
import { ViechleType } from './viechle-type';

export class ScheduleRowMoving implements ScheduleRow {
  isMoving = true;
  description: string;
  url: string;
  memo: string;
  viechle: ViechleType;
  interval: string;
}
