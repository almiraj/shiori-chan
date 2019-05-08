import { Component, Params, ViewChild, ElementRef, OnsNavigator, NgZone } from 'ngx-onsenui';
import * as ons from 'onsenui';
import { timer } from 'rxjs';

import { Plan } from '../entity/plan';
import { Schedule } from '../entity/schedule';
import { ScheduleRowPlace } from '../entity/schedule-row-place';
import { ScheduleRowMoving } from '../entity/schedule-row-moving';
import { PlanTheme } from '../constant/plan-theme';
import { EditModeUtil } from '../util/edit-mode.util';
import { PlanService } from '../service/plan.service';
import { ShareService } from '../service/share.service';
import { EventEmitter } from 'protractor';

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
          <div *ngIf="headEdit.off" class="pencil" (click)="headEdit.toggle()">
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
            <i *ngIf="isFirstTheme" id="theme-carousel-button-left" class="fas fa-chevron-circle-left" (click)="themes.prev()"></i>
            <i *ngIf="isLastTheme" id="theme-carousel-button-right" class="fas fa-chevron-circle-right" (click)="themes.next()"></i>
            <div id="theme-edit-left">
              <ons-carousel #themes fullscreen swipeable auto-scroll overscrollable auto-scroll-ratio="0"
                  [attr.initial-index]="themesInitIdx" (postchange)="selectTheme()">
                <ons-carousel-item *ngFor="let planTheme of planThemes; let i = index">
                  <img [src]="planTheme | themeImg">
                </ons-carousel-item>
              </ons-carousel>
            </div>
            <div id="theme-edit-right">
              <!--<ons-input type="file"></ons-input>-->
            </div>
            <ons-input type="text" id="plan-name-input" modifier="material underbar" [(ngModel)]="plan.name"></ons-input>
          </div>
        </ons-card>
        <ons-card #buggage>
          <div *ngIf="baggageEdit.off" class="pencil" (click)="baggageEdit.toggle()">
            <i class="fas fa-pencil-alt"></i>
          </div>
          <div *ngIf="baggageEdit.on" class="pencil check" (click)="baggageEdit.toggle()">
            <i class="fas fa-check-square"></i>
          </div>
          <div class="title">持ち物・メモ書き</div>
          <div class="content buggage-area">
            <div *ngIf="baggageEdit.on" class="buggage-area-abs">
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
          <ons-carousel #schedules fullscreen auto-scroll overscrollable (postchange)="selectSchedule()">
            <ons-carousel-item *ngFor="let schedule of plan.schedules; let i = index">
              <ons-card>
                <div *ngIf="schedulesEdit.off" class="pencil" (click)="schedulesEdit.toggle()">
                  <i class="fas fa-pencil-alt"></i>
                </div>
                <div *ngIf="schedulesEdit.on" class="pencil check" (click)="schedulesEdit.toggle()">
                  <i class="fas fa-check-square"></i>
                </div>
                <div [style.display]="schedulesEdit.offDisplay" class="title">{{schedule.name}}</div>
                <div [style.display]="schedulesEdit.onDisplay" class="title">
                  <ons-input type="text" modifier="material underbar" [(ngModel)]="schedule.name"></ons-input>
                </div>
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
                <div *ngIf="schedulesEdit.off" class="map-area">
                  <app-map-direction [schedule]="schedule"></app-map-direction>
                </div>
                <div *ngIf="schedulesEdit.on" class="schedule-delete-area">
                  <ons-button modifier="cta" (click)="deleteSchedule(i)">このスケジュールを削除</ons-button>
                </div>
              </ons-card>
            </ons-carousel-item>
          </ons-carousel>
          <div class="plan-delete-area">
            <ons-button modifier="cta" (click)="deletePlan()">このプランを削除</ons-button>
          </div>
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
    '#theme-carousel-button-left { position: absolute; top: 50%; left: 32px; margin-top: -1em; color: #fff; font-size: 2em; z-index: 1;}',
    '#theme-carousel-button-right { position: absolute; top: 50%; right: 32px; margin-top: -1em; color: #fff; font-size: 2em; z-index: 1;}',
    '#plan-name-input { width: 100%; }',
    '.buggage-area { position: relative; }',
    '.buggage-area .buggage-area-abs { position: absolute; width: 100%; height: 100%; }',
    '.buggage-area textarea { width: 100%; height: 100%; margin: 0; padding: 0; border-width: 0 4px 0 0; border-color: #ff1a33; }',
    '.buggage-area textarea { font-size: 14px; line-height: 1.4em; }',
    '.buggage-area textarea { font-family: -apple-system, "Helvetica Neue", "Helvetica", "Arial", "Lucida Grande", sans-serif; }',
    '.buggage-area .pre { min-height: 2.8em; }',
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
    '.map-area { margin-top: 2em; }',
    '.schedule-delete-area { text-align: center; margin-top: 2em; }',
    '.plan-delete-area { text-align: center; margin: 2em; }',
    '.plan-delete-area ons-button { background-color: #bf271f; }',
  ]
})
export class PlanDetailComponent {
  @ViewChild('themes') themesRef: ElementRef;
  @ViewChild('schedules') schedulesRef: ElementRef;
  headEdit = new EditModeUtil();
  baggageEdit = new EditModeUtil();
  schedulesEdit = new EditModeUtil();
  editModeUtils = [this.headEdit, this.baggageEdit, this.schedulesEdit];
  planThemes = PlanTheme.VALUES;
  emitter: EventEmitter;
  plan: Plan;
  themesInitIdx = 0;
  scheduleIdx = 0;
  willForceBack = false;

  constructor(
    private ngZone: NgZone,
    private navi: OnsNavigator,
    private planService: PlanService,
    private shareService: ShareService,
    params: Params,
  ) {
    this.navi.element.addEventListener('prepop', ($event: CustomEvent) => {
      if (!this.willForceBack) {
        this.ngZone.run(() => this.prepop($event));
      }
    });
    this.plan = params.data.plan;
    this.emitter = params.data.emitter;
    this.headEdit.onSaved(() => this.planService.savePlan(this.plan, ['theme', 'name']));
    this.headEdit.onEdit(() => this.themesInitIdx = this.plan.theme.idx);
    this.baggageEdit.onSaved(() => this.planService.savePlan(this.plan, ['baggage']));
    this.schedulesEdit.onSaved(() => this.planService.savePlan(this.plan, ['schedules']));
  }

  get isFirstTheme() {
    return (this.plan.theme.idx !== 0);
  }
  get isLastTheme() {
    return (this.plan.theme.idx !== this.planThemes.length - 1);
  }

  selectTheme() {
    this.plan.theme = PlanTheme.valueOf(this.themesRef.nativeElement.getActiveIndex());
  }
  swipeSchedule(i: number) {
    this.schedulesRef.nativeElement.setActiveIndex(i);
  }
  selectSchedule() {
    this.scheduleIdx = this.schedulesRef.nativeElement.getActiveIndex();
  }
  addSchedule() {
    ons.notification.prompt({ title: '', message: 'スケジュール名を入力してください', cancelable: true })
      .then(_name => {
        if (!_name) {
          return;
        }
        const name = String(_name);
        const sched = new Schedule(name);
        const idx = this.plan.schedules.push(sched) - 1;
        timer(0).subscribe(() => this.swipeSchedule(idx)); // 追加したスケジュールを表示する
      });
  }
  addScheduleRow(i: number) {
    ons.openActionSheet({
      title: '項目を追加する',
      buttons: [ '場所', '移動手段', { label: 'キャンセル', icon: 'md-close' } ],
      cancelable: true
    }).then((type: number) => {
      if (type === 0) {
        // 場所
        if (i !== null) {
          this.plan.schedules[this.scheduleIdx].rows.splice(i, 0, new ScheduleRowPlace());
        } else {
          this.plan.schedules[this.scheduleIdx].rows.push(new ScheduleRowPlace());
        }
        return;
      }
      if (type === 1) {
        // 移動手段
        if (i !== null) {
          this.plan.schedules[this.scheduleIdx].rows.splice(i, 0, new ScheduleRowMoving());
        } else {
          this.plan.schedules[this.scheduleIdx].rows.push(new ScheduleRowMoving());
        }
        return;
      }
    });
  }
  share() {
    for (const editModeUtil of this.editModeUtils) {
      if (editModeUtil.on) {
        ons.notification.alert({ title: '', message: '編集中になっている個所を確定させてから再度お試しください', cancelable: true });
        return;
      }
    }

    this.shareService.sharePlan(this.plan)
      .then(sharedId => {
        ons.notification.prompt({ title: '共有コード', message: '以下のコードをコピーして<br>共有したい人に伝えてください<br><br>', cancelable: true });
        const input = <HTMLInputElement>document.querySelector('.alert-dialog .text-input');
        input.setAttribute('style', 'text-align: center;');
        input.setAttribute('value', sharedId);
        input.onfocus = () => input.select();
      })
      .catch(e => ons.notification.alert({ title: '', message: 'サーバ接続に失敗しました', cancelable: true }));
  }
  deleteSchedule(deleteIdx: number) {
    ons.notification.confirm({ message: 'このスケジュールを削除します', cancelable: true })
      .then(i => {
        if (Number(i) === 1) {
          this.plan.schedules = this.plan.schedules.filter((val, idx) => idx !== deleteIdx);
          ons.notification.alert({ title: '', message: 'スケジュールを削除しました', cancelable: true });
        }
      });
  }
  deletePlan() {
    ons.notification.confirm({ message: '本当にこのプランを削除してもよろしいですか？', cancelable: true })
      .then(i => {
        if (Number(i) === 1) {
          this.emitter.emit('deletePlan');
          ons.notification.alert({ title: '', message: 'このプランは削除されました', cancelable: true })
            .then(() => this.navi.element.popPage());
        }
      });
  }
  prepop($event: CustomEvent) {
    // ポップアップ前に遷移するのを防ぐために一度キャンセルする
    if (!this.willForceBack) {
      $event['cancel']();
    }
    for (const editModeUtil of this.editModeUtils) {
      if (editModeUtil.on) {
        ons.notification.confirm({ message: '編集中の箇所は破棄されますがよろしいですか？', cancelable: true })
          .then(i => {
            if (Number(i) === 1) {
              // 変更を破棄する
              this.emitter.emit('refresh');
              this.willForceBack = true;
              this.navi.element.popPage();
            }
          });
        return;
      }
    }
    this.willForceBack = true;
    this.navi.element.popPage();
  }
}
