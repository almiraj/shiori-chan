import { PlanTheme } from './plan-theme';
import { Schedule } from './schedule';

export class Plan {
  id: string;
  name: string;
  theme: PlanTheme;
  fromYmd: string;
  toYmd: string;
  baggage: string;
  schedules = new Array<Schedule>();

  static desrialize(raw: any) {
    raw.schedules.map((sched: any) => Schedule.desrialize(sched));
    return raw;
  }
}
