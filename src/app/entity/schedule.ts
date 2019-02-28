import { ScheduleRow } from './schedule-row';

export class Schedule {
  rows = new Array<ScheduleRow>();

  constructor(
    public name: string
  ) {}
}
