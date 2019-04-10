import { ScheduleRow } from './schedule-row';
import { ScheduleRowMoving } from './schedule-row-moving';
import { ScheduleRowPlace } from './schedule-row-place';

export class Schedule {
  rows = new Array<ScheduleRow>();

  constructor(
    public name: string
  ) {}

  static desrialize(raw: any) {
    raw.rows.map((row: any) => {
      return (row.isMoving === 'true') ? ScheduleRowMoving.desrialize(row) : ScheduleRowPlace.desrialize(row);
    });
    return raw;
  }
}
