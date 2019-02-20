import { Component, Input, OnsNavigator } from 'ngx-onsenui';
import * as ons from 'onsenui';

import { ScheduleRowPlace } from '../entity/schedule-row-place';

@Component({
  selector: 'app-schedule-row-place',
  template: `
    <ons-list-item>
      <div class="main">
        {{row.fromTime}}
        <div *ngIf="row.toTime">～{{row.toTime}}</div>
        {{row.description}}
      </div>
      <div class="memo pre">{{row.memo}}</div>
    </ons-list-item>
  `,
  styles: [
    '.main { width: 100%; }',
    '.pre { white-space: pre-wrap; }',
    '.memo { font-size: 0.8em; }',
  ]
})
export class ScheduleRowPlaceComponent {
  @Input()
  set row(row: ScheduleRowPlace) {
    this._row = row;
  }
  get row(): ScheduleRowPlace {
    return this._row;
  }
  _row: ScheduleRowPlace;
}
