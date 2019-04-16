import { Component, OnsNavigator } from 'ngx-onsenui';
import * as ons from 'onsenui';

import { PlanDetailComponent } from './plan-detai.component';
import { PlanService } from '../service/plan.service';
import { Plan } from '../entity/plan';
import { PlanTheme } from '../entity/plan-theme';
import { MapComponent } from './map.component';

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
    planService.getPlans().then(plans => this.plans = plans);
  }

  toDetail(plan: Plan) {
    this.navi.element.pushPage(PlanDetailComponent, { data: plan });
  }

  createPlan() {
    ons.openActionSheet({
      title: 'プラン作成',
      cancelable: true,
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
          this.planService
            .createNewPlan(name)
            .then(p => this.plans.push(p));
        }
      }
    });
  }
  createSharedPlan() {
    ons.notification.prompt({
      cancelable: true,
      title: '',
      message: '共有IDを入力してください',
      buttonLabel: 'OK',
      callback: (sharedId: string) => {
        if (sharedId) {
          this.planService
            .createSharedPlan(sharedId)
            .then(p => this.plans.push(p));
        }
      }
    });
  }
}
