import { ScheduleRow } from './schedule-row';

export class ScheduleRowPlace implements ScheduleRow {
  isMoving = false;
  memo: string;
  url: string;
  description = '';
  fromTime: string;
  toTime: string;
  address: string;
  latLng: google.maps.LatLng;
}
