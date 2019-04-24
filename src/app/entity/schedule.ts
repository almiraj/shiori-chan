import { ScheduleRow } from './schedule-row';
import { ScheduleRowMoving } from './schedule-row-moving';
import { ScheduleRowPlace } from './schedule-row-place';
import { LatLng } from './lat-lng';

export class Schedule {
  constructor(
    public name: string,
    public rows = new Array<ScheduleRow>()
  ) {}

  static parse(raw: any) {
    raw.rows.map((row: any) => {
      return (row.isMoving === true) ? ScheduleRowMoving.parse(row) : ScheduleRowPlace.parse(row);
    });
    raw.getLatLngList = Schedule.prototype.getLatLngList;
    return raw;
  }

  getLatLngList(): Array<LatLng> {
    const latLngList = new Array<LatLng>();
    for (const row of this.rows) {
      if (!row.isMoving) {
        const rowPlace = <ScheduleRowPlace>row;
        if (rowPlace.latLng) {
          latLngList.push(rowPlace.latLng);
        }
      }
    }
    return latLngList;
  }
}
