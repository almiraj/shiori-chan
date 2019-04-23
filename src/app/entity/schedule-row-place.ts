import { ScheduleRow } from './schedule-row';
import { LatLng } from './lat-lng';

export class ScheduleRowPlace implements ScheduleRow {
  isMoving = false;
  memo: string;
  url: string;
  description = '';
  fromTime: string;
  toTime: string;
  address: string;
  latLng: LatLng;

  static parse(raw: any) {
    raw.isMoving = false;
    raw.latLng = LatLng.parse(raw.latLng);
    return raw;
  }
}
