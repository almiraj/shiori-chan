import { Component, Params, ViewChild, ElementRef } from 'ngx-onsenui';
import * as ons from 'onsenui';
import { timer } from 'rxjs';
import * as QRCode from 'qrcode';

import { Plan } from '../entity/plan';
import { Schedule } from '../entity/schedule';
import { ScheduleRowPlace } from '../entity/schedule-row-place';
import { ScheduleRowMoving } from '../entity/schedule-row-moving';
import { PlanTheme } from '../entity/plan-theme';
import { EnumUtil } from '../util/enum.util';
import { EditModeService } from '../service/edit-mode.service';
import { PlanService } from '../service/plan.service';
import { AppConfig } from '../constant/app-cofing';

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
          <ons-toolbar-button (click)="share()">Share</ons-toolbar-button>
        </div>
      </ons-toolbar>
      <div class="content">
        <ons-card>
          <div *ngIf="headEdit.off" class="pencil" (click)="headEdit.toggle() && (themesInitIdx = plan.theme)">
            <i class="fas fa-pencil-alt"></i>
          </div>
          <div *ngIf="headEdit.on" class="pencil check" (click)="headEdit.toggle()">
            <i class="fas fa-check-square"></i>
          </div>
          <div *ngIf="headEdit.off">
            <img [src]="plan.theme | themeImg">
            <div class="title">{{plan.name}}</div>
          </div>
          <div *ngIf="headEdit.on">
            <div id="theme-edit-left">
              <ons-carousel #themes fullscreen swipeable auto-scroll overscrollable auto-scroll-ratio="0"
                  [attr.initial-index]="themesInitIdx" (postchange)="selectTheme()">
                <ons-carousel-item *ngFor="let theme of planThemes; let i = index">
                  <img [src]="theme | themeImg">
                </ons-carousel-item>
              </ons-carousel>
            </div>
            <div id="theme-edit-right">
              <!--<ons-input type="file"></ons-input>-->
            </div>
            <ons-input type="text" id="planNameInput" modifier="material underbar" [(ngModel)]="plan.name"></ons-input>
          </div>
        </ons-card>
        <ons-card>
          <app-map-direction shceRowPlace="plan[0].schedules[0]"></app-map-direction>
        </ons-card>
        <ons-card #buggage>
          <div *ngIf="baggageEdit.off" class="pencil" (click)="baggageEdit.toggle()">
            <i class="fas fa-pencil-alt"></i>
          </div>
          <div *ngIf="baggageEdit.on" class="pencil check" (click)="baggageEdit.toggle()">
            <i class="fas fa-check-square"></i>
          </div>
          <div class="title">持ち物・メモ書き</div>
          <div class="content toggleArea">
            <div *ngIf="baggageEdit.on" style="position: absolute; width: 100%; height: 100%;">
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
                <div *ngIf="schedulesEdit.off" class="pencil" (click)="schedulesEdit.toggle()">
                  <i class="fas fa-pencil-alt"></i>
                </div>
                <div *ngIf="schedulesEdit.on" class="pencil check" (click)="schedulesEdit.toggle()">
                  <i class="fas fa-check-square"></i>
                </div>
                <div class="title">{{schedule.name}}</div>
                <div class="content">
                  <ons-list class="schedule-list">
                    <div *ngFor="let row of schedule.rows; let i = index">
                      <div *ngIf="schedulesEdit.on" class="add-schedule" (click)="addScheduleRow(i)">
                        <i class="far fa-arrow-alt-circle-left"></i> 追加
                      </div>
                      <app-schedule-row [schedule]="schedule" [row]="row" [isEdit]="schedulesEdit.on"></app-schedule-row>
                    </div>
                    <div *ngIf="schedulesEdit.on" class="add-schedule" (click)="addScheduleRow(null)">
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
    '.check { color: #ff1a33; }',
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
  ],
  providers: [EditModeService]
})
export class PlanDetailComponent {
  @ViewChild('themes') themesRef: ElementRef;
  @ViewChild('schedules') schedulesRef: ElementRef;
  headEdit = new EditModeService(this.planService);
  baggageEdit = new EditModeService(this.planService);
  schedulesEdit = new EditModeService(this.planService);
  planThemes = this.enumUtil.indexes(PlanTheme);
  plan: Plan;
  themesInitIdx = 0;
  scheduleIdx = 0;

  constructor(
    private planService: PlanService,
    private enumUtil: EnumUtil,
    params: Params,
  ) {
    this.plan = params.data;
    this.headEdit.setSavingItem(this.plan, 'theme', 'name');
    this.baggageEdit.setSavingItem(this.plan, 'baggage');
    this.schedulesEdit.setSavingItem(this.plan, 'schedules');
  }

  selectTheme() {
    this.plan.theme = this.themesRef.nativeElement.getActiveIndex();
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
  share() {
    QRCode.toDataURL('JSON.stringify(this.plan)').then(qrUrl => {
console.log(qrUrl);
      const qrAttachment = qrUrl.replace(/^data:image\/png;base64,/, 'base64:icon.png//');
console.log(qrAttachment);
      window['cordova'].plugins.email.open({
        to: '',
        subject: '旅のしおり「' + this.plan.name + '」が共有されました',
        body: '<b>' + AppConfig.NAME + '</b>を起動し、右上の<b>＋</b>ボタンを押してください。<br>'
          + '「共有されたしおりをコピーする」を選択して、以下のQRコードを指定してください。<br>'
          + '<br>'
          + '<img src="' + qrUrl + '">',
        isHtml: true,
        attachments: qrAttachment
      });
    });
  }
}
