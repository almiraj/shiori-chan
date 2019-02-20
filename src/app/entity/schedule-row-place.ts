import { ScheduleRow } from './schedule-row';

export class ScheduleRowPlace implements ScheduleRow {
  description: string;
  memo: string;
  fromTime: string;
  toTime: string;
  lat: number;
  lng: number;
}
