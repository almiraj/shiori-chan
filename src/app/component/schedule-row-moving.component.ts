import { Component, Input, OnsNavigator } from 'ngx-onsenui';
import * as ons from 'onsenui';

import { ScheduleRowMoving } from '../entity/schedule-row-moving';

@Component({
  selector: 'app-schedule-row-moving',
  template: `
    <ons-list-item class="moving">
      <div class="main">
        {{row.description}}
        <span *ngIf="row.interval"> ({{row.interval}})</span>
      </div>
      <div class="memo pre">{{row.memo}}</div>
    </ons-list-item>
  `,
  styles: [
    '.main { width: 100%; }',
    '.pre { white-space: pre-wrap; }',
    '.moving { border-left: 2px solid #ccc; }',
    '.memo { font-size: 0.8em; }',
  ]
})
export class ScheduleRowMovingComponent {
  @Input()
  set row(row: ScheduleRowMoving) {
    this._row = row;
  }
  get row(): ScheduleRowMoving {
    return this._row;
  }
  _row: ScheduleRowMoving;
}
