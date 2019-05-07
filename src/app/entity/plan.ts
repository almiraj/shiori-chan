import { PlanTheme } from '../constant/plan-theme';
import { Schedule } from './schedule';

export class Plan {
  id: string;
  name: string;
  theme: PlanTheme;
  themeImgPath: string;
  fromYmd: string;
  toYmd: string;
  baggage: string;
  schedules = new Array<Schedule>();

  static parse(raw: any) {
    raw.theme = PlanTheme.parse(raw.theme);
    raw.schedules.map((sched: any) => Schedule.parse(sched));
    return raw;
  }
}
