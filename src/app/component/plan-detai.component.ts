import { Component, Params, ViewChild, ElementRef, AfterContentChecked, AfterViewChecked } from 'ngx-onsenui';
import * as ons from 'onsenui';
import { timer } from 'rxjs';

import { Plan } from '../entity/plan';
import { Schedule } from '../entity/schedule';
import { ScheduleRowPlace } from '../entity/schedule-row-place';
import { ScheduleRowMoving } from '../entity/schedule-row-moving';
import { PlanTheme } from '../entity/plan-theme';
import { EnumUtil } from '../service/enum-util.service';

@Component({
  selector: 'ons-page[page]',
  template: `
    <ons-page class="page">
      <ons-toolbar>
        <div class="left">
          <ons-back-button>Back</ons-back-button>
        </div>
        <div class="center">Plan</div>
        <div class="right">
          <ons-toolbar-button></ons-toolbar-button>
        </div>
      </ons-toolbar>
      <div class="content">
        <ons-card #head>
          <div [hidden]="head.isEdit" class="pencil" (click)="(head.isEdit = !head.isEdit) && swipeTheme()">
            <i class="fas fa-pencil-alt"></i>
          </div>
          <div [hidden]="!head.isEdit" class="pencil envelope" (click)="head.isEdit = !head.isEdit">
            <i class="fas fa-envelope"></i>
          </div>
          <div [hidden]="head.isEdit">
            <img [src]="plan.theme | themeImg">
            <div class="title">{{plan.name}}</div>
          </div>
          <div [hidden]="!head.isEdit && oncheck">
            <div id="theme-edit-left">
              <ons-carousel #themes fullscreen swipeable auto-scroll overscrollable (postchange)="selectTheme()">
                <ons-carousel-item *ngFor="let theme of planThemes; let i = index">
                  <img [src]="theme | themeImg">
                </ons-carousel-item>
              </ons-carousel>
            </div>
            <div id="theme-edit-right">
              <ons-input type="file"></ons-input>
            </div>
            <ons-input type="text" id="planNameInput" modifier="material underbar" [(ngModel)]="plan.name"></ons-input>
          </div>
        </ons-card>
        <ons-card #buggage>
          <div [hidden]="buggage.isEdit" class="pencil" (click)="buggage.isEdit = !buggage.isEdit">
            <i class="fas fa-pencil-alt"></i>
          </div>
          <div [hidden]="!buggage.isEdit" class="pencil envelope" (click)="buggage.isEdit = !buggage.isEdit">
            <i class="fas fa-envelope"></i>
          </div>
          <div class="title">持ち物・メモ書き</div>
          <div class="content toggleArea">
            <div [hidden]="!buggage.isEdit" style="position: absolute; width: 100%; height: 100%;">
              <textarea [(ngModel)]="plan.baggage"></textarea>
            </div>
            <div class="content pre">{{plan.baggage}}</div>
          </div>
        </ons-card>
        <div class="content">
          <ons-carousel-cover>
            <div id="schedules-radio-area">
              <ons-radio name="scheduleIdx" modifier="material" *ngFor="let schedule of plan.schedules; let i = index"
                (change)="swipeSchedule(i)" [attr.value]="i" [checked]="i == scheduleIdx"></ons-radio>
              <i class="fas fa-plus" (click)="addSchedule()"></i>
            </div>
          </ons-carousel-cover>
          <ons-carousel #schedules fullscreen swipeable auto-scroll overscrollable (postchange)="selectSchedule()">
            <ons-carousel-item *ngFor="let schedule of plan.schedules; let i = index">
              <ons-card>
                <div [hidden]="schedules.isEdit" class="pencil" (click)="schedules.isEdit = !schedules.isEdit">
                  <i class="fas fa-pencil-alt"></i>
                </div>
                <div [hidden]="!schedules.isEdit" class="pencil envelope" (click)="schedules.isEdit = !schedules.isEdit">
                  <i class="fas fa-envelope"></i>
                </div>
                <div class="title">{{schedule.name}}</div>
                <div class="content">
                  <ons-list class="schedule-list">
                    <div *ngFor="let row of schedule.rows; let i = index">
                      <div [hidden]="!schedules.isEdit" class="add-schedule" (click)="addScheduleRow(i)">
                        <i class="far fa-arrow-alt-circle-left"></i> 追加
                      </div>
                      <app-schedule-row [schedule]="schedule" [row]="row" [isEdit]="schedules.isEdit"></app-schedule-row>
                    </div>
                    <div [hidden]="!schedules.isEdit" class="add-schedule" (click)="addScheduleRow(null)">
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
    'img { width: 100%; }',
    'ons-card { position: relative; padding-bottom: 20px; }',
    '.pencil { position: absolute; top: 6px; right: 6px; font-size: 1.2em; color: #0076ff; z-index: 100; }',
    '.envelope { color: #ff1a33; }',
    '#planNameInput { width: 100%; }',
    '.toggleArea { position: relative; }',
    '.toggleArea textarea { width: 100%; height: 100%; margin: 0; padding: 0; border-width: 0 4px 0 0; border-color: #ff1a33; }',
    '.toggleArea textarea { font-family: -apple-system, "Helvetica Neue", "Helvetica", "Arial", "Lucida Grande", sans-serif; }',
    '.pre { white-space: pre-wrap; }',
    'ons-carousel { margin-bottom: 1em; }',
    '#schedules-radio-area { text-align: center; }',
    '#schedules-radio-area > ons-radio { display: inline-block; margin: 0 0.4em; }',
    '#schedules-radio-area > i { display: inline-block; margin: 0 0.4em; padding: 2.2px; font-size: 0.8em; }',
    '#schedules-radio-area > i { border: 2px solid #717171; border-radius: 50%; }',
    '.add-schedule { width: 5em; line-height: 1.6em; margin: 1em 0 2px auto; border-radius: 12px; }',
    '.add-schedule { background-color: #f99; color: #fff; text-align: center; }',
    '.add-schedule > i { margin-top: 0.26em; }',
    '.schedule-list { background-position: top; }', // 底部のボーダーを消す
  ]
})
export class PlanDetailComponent implements AfterViewChecked {
  @ViewChild('themes') themesRef: ElementRef;
  @ViewChild('schedules') schedulesRef: ElementRef;

  planThemes = this.enumUtil.indexes(PlanTheme);
  plan: Plan;
  oncheck: boolean;
  scheduleIdx = 0;

  constructor(
    private enumUtil: EnumUtil,
    params: Params,
  ) {
    this.plan = params.data;
  }

  ngAfterViewChecked() {
    this.oncheck = true;
  }

  swipeTheme() {
    timer(1000).subscribe(() => this.themesRef.nativeElement.setActiveIndex(this.plan.theme));
  }
  selectTheme() {
    this.plan.theme = this.themesRef.nativeElement.getActiveIndex();
    console.log(this.plan.theme);
  }
  swipeSchedule(i: number) {
    this.schedulesRef.nativeElement.setActiveIndex(i);
  }
  selectSchedule() {
    this.scheduleIdx = this.schedulesRef.nativeElement.getActiveIndex();
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
