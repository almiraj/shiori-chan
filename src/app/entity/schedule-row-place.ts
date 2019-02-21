import { ScheduleRow } from './schedule-row';

export class ScheduleRowPlace implements ScheduleRow {
  isMoving = false;
  description: string;
  url: string;
  memo: string;
  fromTime: string;
  toTime: string;
  lat: number;
  lng: number;
}
