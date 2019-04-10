import { ScheduleRow } from './schedule-row';

export class ScheduleRowPlace implements ScheduleRow {
  isMoving = false;
  memo: string;
  url: string;
  description = '';
  fromTime: string;
  toTime: string;
  address: string;
  lat: number;
  lng: number;

  static desrialize(raw: any) {
    raw.isMoving = false;
    raw.lat = Number(raw.lat);
    raw.lng = Number(raw.lng);
    return raw;
  }
}
