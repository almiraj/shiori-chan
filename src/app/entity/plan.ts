// import * as moment from 'moment';

import { PlanTheme } from './plan-theme';

export class Plan {
  id: String;
  name: String;
  theme: PlanTheme;
  fromYmd: String;
  toYmd: String;
}
