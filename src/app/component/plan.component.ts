import { Component, OnsNavigator } from 'ngx-onsenui';
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
        <div class="center">Navigation</div>
        <div class="right">
          <ons-toolbar-button (click)="createPlan()">＋</ons-toolbar-button>
        </div>
      </ons-toolbar>
      <div class="content">
        <div class="plan-card list-item--chevron" *ngFor="let plan of plans" (click)="toDetail(plan)">
          <ons-card>
            <ons-ripple></ons-ripple>
            <img src="https://monaca.io/img/logos/download_image_onsenui_01.png">
            <div class="title">{{plan.name}}</div>
          </ons-card>
        </div>
      </div>
    </ons-page>

    <!-- must be located just under an outermost box such as body element -->
    <ons-dialog animation="default" cancelable #dialog>
      <div class="dialog-mask"></div>
        <div class="dialog">
          <div class="dialog-container" style="height: 200px;">
            <ons-page>
              <ons-toolbar>
                <div class="center">Name</div>
              </ons-toolbar>
              <div class="content">
                <div style="text-align: center">
                  <p>This is just an example.</p>
                  <br>
                  <ons-button (click)="dialog.hide()">Close</ons-button>
                </div>
              </div>
            </ons-page>
          </div>
        </div>
    </ons-dialog>

    <!-- must be located just under an outermost box such as body element -->
    <ons-alert-dialog cancelable #alertDialog>
      <div class="alert-dialog-title">Warning!</div>
      <div class="alert-dialog-content">
        This is just an example.
      </div>
      <div class="alert-dialog-footer">
        <ons-alert-dialog-button (click)="alertDialog.hide()">OK</ons-alert-dialog-button>
      </div>
    </ons-alert-dialog>
  `,
  styles: [
    '.plan-card { position: relative; }',
    '.plan-card > ons-card { text-align: center; padding: 16px 20px; }',
    '.plan-card > ons-card > div { text-align: left; }',
    '.plan-card img { width: 100%; }',
  ]
})
export class PlanComponent {
  plans: Plan[];

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
    ons.notification.prompt({
      cancelable: true,
      title: '',
      message: 'プラン名を入力してください',
      callback: (name: string) => {
        if (name) {
          this.planService.createPlan(name).then(p => this.plans.push(p));
        }
      }
    });
  }
}