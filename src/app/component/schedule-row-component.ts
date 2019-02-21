import { Component, Input, OnsNavigator } from 'ngx-onsenui';
import * as ons from 'onsenui';

import { ScheduleRow } from '../entity/schedule-row';
import { ScheduleRowPlace } from '../entity/schedule-row-place';
import { ScheduleRowMoving } from '../entity/schedule-row-moving';

@Component({
  selector: 'app-schedule-row',
  template: `
    <ons-list-item [ngClass]="{ 'moving': row.isMoving }">
      <div class="main">
        <span *ngIf="placeRow">
          {{placeRow.fromTime}}
          <span *ngIf="placeRow.toTime">- {{placeRow.toTime}}</span>
        </span>
        {{row.description}}
        <span *ngIf="movingRow && movingRow.interval"> ({{movingRow.interval}})</span>
        <div class="right-icon" *ngIf="row.url"><a [href]="row.url" target="_blank"><i class="fas fa-external-link-alt"></i></a></div>
      </div>
      <div class="memo pre">{{row.memo}}</div>
    </ons-list-item>
  `,
  styles: [
    '.main { width: 100%; position: relative; }',
    '.right-icon { position: absolute; top: 0; right: 0; line-height: 1.2em; }',
    '.memo { font-size: 0.8em; }',
    '.pre { white-space: pre-wrap; }',
    '.moving { border-left: 2px solid #ccc; }',
  ]
})
export class ScheduleRowComponent {
  @Input()
  set row(row: ScheduleRow) {
    this._row = row;
  }
  get row(): ScheduleRow {
    return this._row;
  }
  _row: ScheduleRow;

  get placeRow(): ScheduleRowPlace {
    if (!this._row.isMoving) {
      return <ScheduleRowPlace>this._row;
    }
    return null;
  }
  get movingRow(): ScheduleRowMoving {
    if (this._row.isMoving) {
      return <ScheduleRowMoving>this._row;
    }
    return null;
  }
}
