import { ScheduleRow } from './schedule-row';
import { ViechleType } from './viechle-type';

export class ScheduleRowMoving implements ScheduleRow {
  description: string;
  memo: string;
  viechle: ViechleType;
  url: string;
}
