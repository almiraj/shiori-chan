import { Component, OnsNavigator } from 'ngx-onsenui';
import * as ons from 'onsenui';

import { PlanDetailComponent } from './plan-detai.component';
import { PlanService } from '../service/plan.service';
import { Plan } from '../entity/plan';
import { PlanTheme } from '../entity/plan-theme';

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
          <ons-toolbar-button (click)="createPlan()">＋</ons-toolbar-button>
        </div>
      </ons-toolbar>
      <div class="content">
        <div class="plan-card list-item--chevron" *ngFor="let plan of plans" (click)="toDetail(plan)">
          <ons-card>
            <ons-ripple></ons-ripple>
            <img [src]="plan.theme | planImg">
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
export class PlanComponent {
  plans: Plan[];
  dialogButtonName: string;

  constructor(
    private navi: OnsNavigator,
    private planService: PlanService
  ) {
    planService.getPlans().then(plans => this.plans = plans);
  }

  toDetail(plan: Plan) {
    this.navi.element.pushPage(PlanDetailComponent, {data: plan});
  }

  createPlan() {
    this.dialogButtonName = 'プラン作成';
    ons.notification.prompt({
      cancelable: true,
      title: '',
      message: 'プラン名を入力してください',
      buttonLabel: 'OK',
      callback: (name: string) => {
        if (name) {
          this.planService
            .createPlan(name, PlanTheme.CAFE)
            .then(p => this.plans.push(p));
        }
      }
    });
  }
}