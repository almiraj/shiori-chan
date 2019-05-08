import { Component, OnsNavigator, Output, EventEmitter } from 'ngx-onsenui';
import * as ons from 'onsenui';

import { PlanDetailComponent } from './plan-detai.component';
import { PlanService } from '../service/plan.service';
import { Plan } from '../entity/plan';

@Component({
  selector: 'ons-page[page]',
  template: `
    <ons-page class="page">
      <ons-toolbar>
        <div class="left">
          <ons-back-button>Back</ons-back-button>
        </div>
        <div class="center">Shiori chan</div>
        <div class="right">
          <ons-toolbar-button (click)="createPlan()">＋</ons-toolbar-button>
        </div>
      </ons-toolbar>
      <div class="content">
        <div class="plan-card list-item--chevron" *ngFor="let plan of plans" (click)="toDetail(plan)">
          <ons-card>
            <ons-ripple></ons-ripple>
            <img [src]="plan.theme | themeImg">
            <div class="title">{{plan.name}}</div>
          </ons-card>
        </div>
      </div>
    </ons-page>
  `,
  styles: [
    'img { width: 100%; }',
    '.plan-card { position: relative; }',
    '.plan-card > ons-card { text-align: center; padding: 16px 20px; margin-bottom: 10px; }',
    '.plan-card > ons-card > div { text-align: left; }',
    '.plan-card img { width: 100%; }',
  ]
})
export class PlanListComponent {
  plans: Plan[];

  constructor(
    private navi: OnsNavigator,
    private planService: PlanService
  ) {
    this.plans = planService.getPlans();
  }

  toDetail(plan: Plan) {
    const emitter = new EventEmitter<void>();
    emitter.subscribe((event: string) => {
      if (event === 'deletePlan') {
        this.plans = this.plans.filter(p => p.id !== plan.id);
        this.planService.saveAllPlan(this.plans);
      }
      if (event === 'refresh') {
        this.plans = this.planService.getPlans();
      }
    })
    this.navi.element.pushPage(PlanDetailComponent, { data: { plan: plan, emitter: emitter } });
  }
  createPlan() {
    ons.openActionSheet({
      cancelable: true,
      title: 'プラン作成',
      buttons: [ '新しいプランを作成', '共有されたプランから作成', { label: 'キャンセル', icon: 'md-close' } ],
      callback: (type: number) => {
        if (type === 0) {
          this.createNewPlan();
        } else if (type === 1) {
          this.createSharedPlan();
        }
      }
    });
  }
  createNewPlan() {
    ons.notification.prompt({
      cancelable: true,
      title: '',
      message: 'プラン名を入力してください',
      buttonLabel: 'OK',
      callback: (name: string) => {
        if (name) {
          this.planService.createNewPlan(name)
            .then(p => {
              if (!this.planService.addPlan(p)) {
                throw new Error('プラン追加に失敗しました');
              }
              this.plans.unshift(p);
            });
        }
      }
    });
  }
  createSharedPlan() {
    ons.notification.prompt({ title: '', message: '共有IDを入力してください', buttonLabel: 'OK', cancelable: true })
      .then(_sharedId => {
        const sharedId = String(_sharedId);
        if (sharedId) {
          this.planService.createSharedPlan(sharedId)
            .then(createdPlan => {
              // 追加できる場合は普通に追加する
              if (this.planService.addPlan(createdPlan)) {
                this.plans.unshift(createdPlan);
                return;
              }
              // 追加できない場合は確認してから更新する
              ons.notification.confirm({ cancelable: true, message: '共有されたプランを更新してよろしいですか？' })
                .then(_i => {
                  const i = Number(_i);
                  if (i === 1) {
                    this.planService.overwritePlan(createdPlan);
                    this.plans = this.plans.map(p => (p.id === createdPlan.id) ? createdPlan : p);
                  }
                });
            })
            .catch(e => ons.notification.alert({ title: '', message: e, cancelable: true }));
        }
      });
  }
}
