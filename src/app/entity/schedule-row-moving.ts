import { ScheduleRow } from './schedule-row';
import { ViechleType } from './viechle-type';

export class ScheduleRowMoving implements ScheduleRow {
  isMoving = true;
  memo: string;
  url: string;
  interval = '00:00';
  viechleType = ViechleType.WALK;

  getIntervalLabel() {
    return this.interval.replace(/(\d+):(\d+)/, (a0: string, a1: string, a2: string) => {
      if (a1 === '00' && a2 === '00') {
        return 'すぐ';
      }
      if (a1 !== '00' && a2 === '00') {
        return a1.replace(/^0/, '') + '時間';
      }
      if (a1 === '00' && a2 !== '00') {
        return a2.replace(/^0/, '') + '分';
      }
      return a1.replace(/^0/, '') + '時間' + a2.replace(/^0/, '') + '分';
    });
  }
}
