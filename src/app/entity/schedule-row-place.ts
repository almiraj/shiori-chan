import { ScheduleRow } from './schedule-row';

export class ScheduleRowPlace implements ScheduleRow {
  isMoving = false;
  memo: string;
  url: string;
  description = '';
  fromTime: string;
  toTime: string;
  lat: number;
  lng: number;
}
