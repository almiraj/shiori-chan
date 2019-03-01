import { Component, Params, ViewChild, ElementRef } from 'ngx-onsenui';
import * as ons from 'onsenui';
import { timer } from 'rxjs';

import { Plan } from '../entity/plan';
import { Schedule } from '../entity/schedule';
import { ScheduleRowPlace } from '../entity/schedule-row-place';
import { ScheduleRowMoving } from '../entity/schedule-row-moving';

@Component({
  selector: 'ons-page[page]',
  template: `
    <ons-page class="page">
      <ons-toolbar>
        <div class="left">
          <ons-back-button>Back</ons-back-button>
        </div>
        <div class="center">Navigation</div>
        <div class="right">
          <ons-toolbar-button>share</ons-toolbar-button>
        </div>
      </ons-toolbar>
      <div class="content">
        <ons-card>
          <img src="https://monaca.io/img/logos/download_image_onsenui_01.png" alt="Onsen UI" style="width: 100%">
          <div class="title">{{plan.name}}</div>
        </ons-card>
        <ons-card #buggage>
          <div *ngIf="!buggage.isEdit" class="pencil" (click)="buggage.isEdit = !buggage.isEdit">
            <i class="fas fa-pencil-alt"></i>
          </div>
          <div *ngIf="buggage.isEdit" class="pencil envelope" (click)="buggage.isEdit = !buggage.isEdit">
            <i class="fas fa-envelope"></i>
          </div>
          <div class="title">持ち物・メモ書き</div>
          <div class="content toggleArea">
            <div *ngIf="buggage.isEdit" style="position: absolute; width: 100%; height: 100%;">
              <textarea [(ngModel)]="plan.baggage"></textarea>
            </div>
            <div class="content pre">{{plan.baggage}}</div>
          </div>
        </ons-card>
        <div class="content">
          <ons-carousel-cover>
            <div id="carousel-button">
              <ons-radio name="scheduleIdx" modifier="material" *ngFor="let schedule of plan.schedules; let i = index"
                (change)="swipeSchedule(i)" [attr.value]="i" [checked]="i == scheduleIdx"></ons-radio>
              <i class="fas fa-plus" (click)="addSchedule()"></i>
            </div>
          </ons-carousel-cover>
          <ons-carousel #carousel fullscreen swipeable auto-scroll overscrollable (postchange)="selectSchedule()">
            <ons-carousel-item *ngFor="let schedule of plan.schedules; let i = index">
              <ons-card>
                <div *ngIf="!carousel.isEdit" class="pencil" (click)="carousel.isEdit = !carousel.isEdit">
                  <i class="fas fa-pencil-alt"></i>
                </div>
                <div *ngIf="carousel.isEdit" class="pencil envelope" (click)="carousel.isEdit = !carousel.isEdit">
                  <i class="fas fa-envelope"></i>
                </div>
                <div class="title">{{schedule.name}}</div>
                <div class="content">
                  <ons-list class="schedule-list">
                    <div *ngFor="let row of schedule.rows; let i = index">
                      <div *ngIf="carousel.isEdit" class="add-schedule" (click)="addScheduleRow(i)">
                        <i class="far fa-arrow-alt-circle-left"></i> 追加
                      </div>
                      <app-schedule-row [schedule]="schedule" [row]="row" [isEdit]="carousel.isEdit"></app-schedule-row>
                    </div>
                    <div *ngIf="carousel.isEdit" class="add-schedule" (click)="addScheduleRow(null)">
                      <i class="far fa-arrow-alt-circle-left"></i> 追加
                    </div>
                  </ons-list>
                </div>
              </ons-card>
            </ons-carousel-item>
          </ons-carousel>
        </div>
      </div>
    </ons-page>
  `,
  styles: [
    'i { font-size: 1.2em; }',
    'ons-card { position: relative; padding-bottom: 20px; }',
    'ons-card > .pencil { position: absolute; top: 6px; right: 6px; font-size: 1.2em; color: #0076ff; }',
    'ons-card > .envelope { color: #ff1a33; }',
    '.toggleArea { position: relative; }',
    '.toggleArea textarea { width: 100%; height: 100%; margin: 0; padding: 0; border-width: 0 4px 0 0; border-color: #ff1a33; }',
    '.toggleArea textarea { font-family: -apple-system, "Helvetica Neue", "Helvetica", "Arial", "Lucida Grande", sans-serif; }',
    '.pre { white-space: pre-wrap; }',
    'ons-carousel { margin-bottom: 1em; }',
    '#carousel-button { text-align: center; }',
    '#carousel-button > ons-radio { display: inline-block; margin: 0 0.4em; }',
    '#carousel-button > i { display: inline-block; margin: 0 0.4em; padding: 2.2px; font-size: 0.8em; }',
    '#carousel-button > i { border: 2px solid #717171; border-radius: 50%; }',
    '.add-schedule { width: 5em; line-height: 1.6em; margin: 1em 0 2px auto; border-radius: 12px; }',
    '.add-schedule { background-color: #f99; color: #fff; text-align: center; }',
    '.add-schedule > i { margin-top: 0.26em; }',
    '.schedule-list { background-position: top; }', // 底部のボーダーを消す
  ]
})
export class PlanDetailComponent {
  @ViewChild('carousel') carouselRef: ElementRef;
  plan: Plan;
  scheduleIdx = 0;

  constructor(
    params: Params
  ) {
    this.plan = params.data;
  }

  swipeSchedule(i: number) {
    this.carouselRef.nativeElement.setActiveIndex(i);
  }
  selectSchedule() {
    this.scheduleIdx = this.carouselRef.nativeElement.getActiveIndex();
  }
  addSchedule() {
    ons.notification.prompt({
      cancelable: true,
      title: '',
      message: 'スケジュール名を入力してください',
      callback: (name: string) => {
        if (name) {
          const sche = new Schedule(name);
          sche.rows.push(new ScheduleRowPlace());
          const idx = this.plan.schedules.push(sche) - 1;
          timer(0).subscribe(() => this.swipeSchedule(idx)); // 追加したスケジュールを表示する
        }
      }
    });
  }
  addScheduleRow(i: number) {
    ons.openActionSheet({
      title: '項目を追加する',
      cancelable: true,
      buttons: [ '移動手段', '場所／行動', { label: 'キャンセル', icon: 'md-close' } ],
      callback: (type: number) => {
        if (type === 0) {
          // 移動手段
          if (i !== null) {
            this.plan.schedules[this.scheduleIdx].rows.splice(i, 0, new ScheduleRowMoving());
          } else {
            this.plan.schedules[this.scheduleIdx].rows.push(new ScheduleRowMoving());
          }
          return;
        }
        if (type === 1) {
          // 場所／行動
          if (i !== null) {
            this.plan.schedules[this.scheduleIdx].rows.splice(i, 0, new ScheduleRowPlace());
          } else {
            this.plan.schedules[this.scheduleIdx].rows.push(new ScheduleRowPlace());
          }
          return;
        }
      }
    });
  }
}
