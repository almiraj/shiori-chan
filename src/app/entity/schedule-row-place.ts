import { ScheduleRow } from './schedule-row';

export class ScheduleRowPlace implements ScheduleRow {
  isMoving = false;
  memo: string;
  url: string;
  description: string;
  fromTime: string;
  toTime: string;
  lat: number;
  lng: number;
}
