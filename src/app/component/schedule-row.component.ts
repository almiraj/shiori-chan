import { Component, Input, OnsNavigator } from 'ngx-onsenui';
import * as ons from 'onsenui';

import { ScheduleRow } from '../entity/schedule-row';
import { ScheduleRowPlace } from '../entity/schedule-row-place';
import { ScheduleRowMoving } from '../entity/schedule-row-moving';
import { Schedule } from '../entity/schedule';
import { ViechleType, ViechleTypeUtil } from '../entity/viechle-type';
import { MapComponent } from './map.component';

@Component({
  selector: 'app-schedule-row',
  template: `
    <ons-list-item [ngClass]="{ 'edit-item': isEdit }">
      <div class="rel">
        <div *ngIf="schedRowPlace" class="left-icon"
            [ngClass]="{ 'left-icon-edit': isEdit, 'with-to-time': schedRowPlace.fromTime !== schedRowPlace.toTime }">
          <i class="fas fa-flag-checkered"></i>
        </div>
        <div *ngIf="shcedRowMoving && isEdit" class="left-icon-viechle">
          <label *ngFor="let v of ViechleTypeUtil.values(); let i = index" (click)="changeViechle(v)"><!--changeはMobile Safariで発火しない-->
            <input type="radio" [name]="'vt-' + i" [value]="shcedRowMoving.viechleType" [checked]="v === shcedRowMoving.viechleType">
            <i [ngClass]="{
              'fas': true,
              'fa-walking': v === ViechleType.WALK,
              'fa-swimmer': v === ViechleType.SWIMMER,
              'fa-bicycle': v === ViechleType.BICYCLE,
              'fa-motorcycle': v === ViechleType.MOTORCYCLE,
              'fa-car': v === ViechleType.CAR,
              'fa-taxi': v === ViechleType.TAXI,
              'fa-bus-alt': v === ViechleType.BUS,
              'fa-train': v === ViechleType.TRAIN,
              'fa-plane': v === ViechleType.AIRPLAIN,
              'fa-ship': v === ViechleType.SHIP,
              'fa-tram': v === ViechleType.TRAM,
              'fa-helicopter': v === ViechleType.HELICOPTER,
              'selected': v === shcedRowMoving.viechleType
            }"></i>
          </label>
        </div>
        <div *ngIf="schedRowPlace && !isEdit" class="fromToTime">
          {{schedRowPlace.fromTime}}
          <br>
          <span *ngIf="schedRowPlace.fromTime != schedRowPlace.toTime">{{schedRowPlace.toTime}}</span>
        </div>
        <div *ngIf="schedRowPlace && isEdit" class="fromToTime">
          <ons-input type="time" modifier="material underbar" [(ngModel)]="schedRowPlace.fromTime" (change)="syncToTime()"></ons-input>
          <br>
          <ons-input type="time" modifier="material underbar" [(ngModel)]="schedRowPlace.toTime"></ons-input>
        </div>
        <div *ngIf="shcedRowMoving && !isEdit" class="viechle-type">
          <i [ngClass]="{
            'fas': true,
            'fa-walking': shcedRowMoving.viechleType === ViechleType.WALK,
            'fa-swimmer': shcedRowMoving.viechleType === ViechleType.SWIMMER,
            'fa-bicycle': shcedRowMoving.viechleType === ViechleType.BICYCLE,
            'fa-motorcycle': shcedRowMoving.viechleType === ViechleType.MOTORCYCLE,
            'fa-car': shcedRowMoving.viechleType === ViechleType.CAR,
            'fa-taxi': shcedRowMoving.viechleType === ViechleType.TAXI,
            'fa-bus-alt': shcedRowMoving.viechleType === ViechleType.BUS,
            'fa-train': shcedRowMoving.viechleType === ViechleType.TRAIN,
            'fa-plane': shcedRowMoving.viechleType === ViechleType.AIRPLAIN,
            'fa-ship': shcedRowMoving.viechleType === ViechleType.SHIP,
            'fa-tram': shcedRowMoving.viechleType === ViechleType.TRAM,
            'fa-helicopter': shcedRowMoving.viechleType === ViechleType.HELICOPTER
          }"></i>
        </div>
        <div *ngIf="schedRowPlace && !isEdit" class="description"
            [ngClass]="{ 'with-to-time': schedRowPlace.fromTime !== schedRowPlace.toTime }">
          {{schedRowPlace.description}}
          <div class="baggage pre">{{row.memo}}</div>
        </div>
        <div *ngIf="shcedRowMoving && !isEdit" class="description interval">
          ({{shcedRowMoving.getIntervalLabel()}})
          <div class="baggage pre">{{row.memo}}</div>
        </div>
        <div *ngIf="schedRowPlace && isEdit" class="description-edit">
          <ons-input type="text" modifier="material underbar" [(ngModel)]="schedRowPlace.description"></ons-input>
          <textarea class="memo" placeholder="メモ書き" [(ngModel)]="row.memo"></textarea>
          </div>
        <div *ngIf="shcedRowMoving && isEdit" class="description-edit">
          所要時間：<ons-input type="time" modifier="material underbar" [(ngModel)]="shcedRowMoving.interval"></ons-input>
          <textarea class="memo" placeholder="メモ書き" [(ngModel)]="row.memo"></textarea>
        </div>
        <div *ngIf="!isEdit">
          <div *ngIf="schedRowPlace && schedRowPlace.latLng" class="right-icon">
            <i class="fas fa-map-marked-alt link-color" (click)="toMap(schedRowPlace, true)"></i>
          </div>
          <div class="right-icon" *ngIf="row.url">
            <a [href]="row.url" target="_blank">
              <i [ngClass]="{
                'fas': true,
                'fa-external-link-alt': true,
                'with-to-time': schedRowPlace && schedRowPlace.fromTime !== schedRowPlace.toTime
              }"></i>
            </a>
          </div>
        </div>
        <div *ngIf="isEdit">
          <div class="right-icon">
            <i class="far fa-window-close" (click)="confirmDelete()"></i>
            <div *ngIf="schedRowPlace" class="right-bottom-icon">
              <i class="fas fa-map-marked-alt" (click)="toMap(schedRowPlace)"></i>
            </div>
          </div>
        </div>
      </div>
    </ons-list-item>
    `,
  styles: [
    'i { font-size: 1.2em; }',
    'ons-list-item { padding: 0; }',
    'ons-input { margin-bottom: 0.5em; }',
    // 'ons-input .text-input { styles.cssで定義 }',
    '.rel { width: 100%; position: relative; }',
    '.left-icon { display: inline-block; vertical-align: top; width: 1em; margin-right: 1em; }',
    '.left-icon-edit { margin-right: 0.6em; }',
    '.left-icon-viechle { display: inline-block; vertical-align: top; width: 5.4em; margin-right: 1em; }',
    '.left-icon-viechle input { display: none; }',
    '.left-icon-viechle i { font-size: 1.4em; color: #ccc; width: 1.4em; margin: 0 0.5em 0.5em 0; text-align: center; }',
    '.left-icon-viechle i.selected { color: red; }',
    '.right-icon, .fromToTime, .description { margin-left: 0.5em; }',
    '.right-icon { position: absolute; top: 0; right: 0; height: 100%; line-height: 1.2em; }',
    '.right-bottom-icon { position: absolute; bottom: 4px; color: #cc6666; }',
    '.fromToTime { display: inline-block; margin-right: 0.4em; }',
    '.with-to-time { margin-top: 0.65em; }',
    '.viechle-type { display: inline-block; font-size: 1.4em; width: 1.4em; margin: 0 0.7em 0 2em; text-align: center; }',
    '.description { display: inline-block; vertical-align: top; }',
    '.description.interval { margin-top: 2px; }',
    '.description-edit { display: inline-block; vertical-align: top; width: 65%; }',
    '.baggage { font-size: 0.85em; color: #666; width: 100%; margin-top: 0.5em; }',
    '.memo { font-size: 0.8em; color: #666; width: 85%; margin-top: 0.5em; }',
    'textarea.memo { height: 3.4em; }',
    '.pre { white-space: pre-wrap; }',
    '.link-color { color: #0076ff; }',
  ]
})
export class ScheduleRowComponent {
  private _schedule: Schedule;
  private _row: ScheduleRow;
  private _isEdit: boolean;
  private _prevFromTime: string;
  ViechleType = ViechleType;
  ViechleTypeUtil = ViechleTypeUtil;

  @Input()
  set schedule(schedule: Schedule) { this._schedule = schedule; }
  get schedule(): Schedule { return this._schedule; }

  @Input()
  set row(row: ScheduleRow) { this._row = row; }
  get row(): ScheduleRow { return this._row; }

  get schedRowPlace(): ScheduleRowPlace {
    if (!this._row.isMoving) {
      return <ScheduleRowPlace>this._row;
    }
    return null;
  }
  get shcedRowMoving(): ScheduleRowMoving {
    if (this._row.isMoving) {
      return <ScheduleRowMoving>this._row;
    }
    return null;
  }

  @Input()
  set isEdit(isEdit: boolean) { this._isEdit = isEdit; }
  get isEdit(): boolean { return this._isEdit; }

  constructor(
    private navi: OnsNavigator,
  ) {}

  syncToTime() {
    if (!this.schedRowPlace.toTime || this.schedRowPlace.toTime === this._prevFromTime) {
      this.schedRowPlace.toTime = this.schedRowPlace.fromTime;
    }
    this._prevFromTime = this.schedRowPlace.fromTime;
  }
  changeViechle(v: ViechleType) {
    if (this.shcedRowMoving) {
      this.shcedRowMoving.viechleType = v;
    }
  }
  confirmDelete() {
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
  toMap(schedRowPlace: ScheduleRowPlace, readOnly?: boolean) {
    this.navi.element.pushPage(MapComponent, { data: { schedRowPlace, readOnly } });
  }
}
