import { ScheduleRow } from './schedule-row';
import { ViechleType } from './viechle-type';

export class ScheduleRowMoving implements ScheduleRow {
  isMoving = true;
  description: string;
  memo: string;
  url: string;
  viechle: ViechleType;
  interval: string;
}
