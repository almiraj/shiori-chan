import { Component, Input, OnsNavigator, ElementRef, ViewChildren, DoCheck } from 'ngx-onsenui';
import * as ons from 'onsenui';

import { ScheduleRow } from '../entity/schedule-row';
import { ScheduleRowPlace } from '../entity/schedule-row-place';
import { ScheduleRowMoving } from '../entity/schedule-row-moving';
import { PlanDetailComponent } from './plan-detai.component';
import { Schedule } from '../entity/schedule';

@Component({
  selector: 'app-schedule-row',
  template: `
    <ons-list-item [ngClass]="{ 'isEdit': isEdit, 'moving': row.isMoving }">
      <div class="rel">
        <div *ngIf="isEdit">
          <div class="right-icon" (click)="confirm()">
            <i class="far fa-window-close"></i>
          </div>
        </div>
        <div class="left-icon">
          <i class="fas fa-flag-checkered"></i>
        </div>
        <div *ngIf="placeRow && !isEdit" class="fromToTime">
          {{placeRow.fromTime}}
          <span *ngIf="placeRow.fromTime != placeRow.toTime">- {{placeRow.toTime}}</span>
        </div>
        <div *ngIf="placeRow && isEdit" class="fromToTime">
          <ons-input #inp type="time" modifier="material underbar" [(ngModel)]="placeRow.fromTime" (change)="setToTime()"></ons-input>
          <br>
          <ons-input #inp type="time" modifier="material underbar" [(ngModel)]="placeRow.toTime"></ons-input>
        </div>
        <div *ngIf="!isEdit" class="description">
          {{row.description}}
          <div class="memo pre">{{row.memo}}</div>
        </div>
        <div *ngIf="isEdit" class="descriptionEdit">
          <ons-input #inp type="text" modifier="material underbar" [(ngModel)]="row.description"></ons-input>
          <textarea class="memo" placeholder="メモ書き" [(ngModel)]="row.memo"></textarea>
        </div>
        <div *ngIf="movingRow && movingRow.interval"> ({{movingRow.interval}})</div>
        <div *ngIf="!isEdit">
          <div class="right-icon" *ngIf="row.url">
            <a [href]="row.url" target="_blank">
              <i *ngIf="placeRow" class="far fa-compass"></i>
              <i *ngIf="movingRow" class="fas fa-external-link-alt"></i>
            </a>
          </div>
        </div>
      </div>
    </ons-list-item>
  `,
  styles: [
    'ons-list-item { padding: 0; }',
    'ons-input { margin-bottom: 0.5em; }',
    '.isEdit { border-bottom: 2px dotted #ff1a33; }',
    '.rel { width: 100%; position: relative; }',
    '.left-icon { display: inline-block; vertical-align: top; margin-right: 0.4em; }',
    '.right-icon, .fromToTime, .description { margin-left: 0.5em; }',
    '.right-icon { position: absolute; top: 0; right: 0; line-height: 1.2em; }',
    '.fromToTime { display: inline-block; margin-right: 0.4em; }',
    '.description { display: inline-block; vertical-align: top; }',
    '.descriptionEdit { display: inline-block; vertical-align: top; width: 60%; }',
    '.memo { font-size: 0.8em; width: 100%; }',
    'textarea.memo { height: 3.4em; }',
    '.pre { white-space: pre-wrap; }',
    '.moving { border-left: 2px solid #ccc; }',
  ]
})
export class ScheduleRowComponent implements DoCheck {
  @ViewChildren('inp') inp: ElementRef;
  private _schedule: Schedule;
  private _row: ScheduleRow;
  private _isEdit: boolean;
  private _prevFromTime: string;

  constructor(private parent: PlanDetailComponent) {
  }

  @Input()
  set schedule(schedule: Schedule) {
    this._schedule = schedule;
  }
  get schedule(): Schedule {
    return this._schedule;
  }

  @Input()
  set row(row: ScheduleRow) {
    this._row = row;
    if (!this._row.isMoving) {
      this.setToTime();
    }
  }
  get row(): ScheduleRow {
    return this._row;
  }
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

  @Input()
  set isEdit(isEdit: boolean) {
    this._isEdit = isEdit;
  }
  get isEdit(): boolean {
    return this._isEdit;
  }

  ngDoCheck() {
    // ons-inputが動的に生成してくるinputのstyleを強引に書き換える
    if (this.inp) {
      this.inp['_results'].forEach((elem: ElementRef) => {
        const inputElement = elem.nativeElement.childNodes[1];
        if (inputElement && inputElement.nodeName === 'INPUT') {
          inputElement.style.fontSize = 'inherit';
          inputElement.style.fontFamily = '-apple-system, "Helvetica Neue", "Helvetica", "Arial", "Lucida Grande", sans-serif';
        }
      });
    }
  }
  setToTime() {
    if (!this.placeRow.toTime || this.placeRow.toTime === this._prevFromTime) {
      this.placeRow.toTime = this.placeRow.fromTime;
    }
    this._prevFromTime = this.placeRow.fromTime;
  }

  confirm() {
    ons.notification.confirm({
      message: 'この項目を削除してよろしいですか？',
      cancelable: true,
      callback: (i: number) => {
        console.log(i);
        if (i) {
          this.schedule.rows = this.schedule.rows.filter(val => val !== this.row);
        }
      }
    });
  }
}
