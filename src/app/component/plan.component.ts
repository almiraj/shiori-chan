import { Component, OnsNavigator } from 'ngx-onsenui';
import * as ons from 'onsenui';

import { PlanDetailComponent } from '../component/plan-detai.component';
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
          <ons-toolbar-button (click)="confirm()">＋</ons-toolbar-button>
        </div>
      </ons-toolbar>
      <div class="content">
        <ons-list>
          <ons-list-header>プラン</ons-list-header>
          <ons-list-item modifier="chevron" tappable *ngFor="let plan of plans" (click)="toDetail(plan)">{{plan.name}}</ons-list-item>
          <ons-list-item tappable (click)="confirm()">Confirmation</ons-list-item>
          <ons-list-item tappable (click)="prompt()">Prompt</ons-list-item>
          <ons-list-item tappable (click)="toast()">Toast</ons-list-item>

          <ons-list-header>Components</ons-list-header>
          <ons-list-item tappable (click)="dialog.show()">Simple Dialog</ons-list-item>
          <ons-list-item tappable (click)="alertDialog.show()">Alert Dialog</ons-list-item>
          </ons-list>
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
  styles: []
})
export class PlanComponent {
  plans: Array<Plan> = [];

  constructor(private navi: OnsNavigator) {
    if (this.plans.length === 0) {
      const samplePlan = new Plan();
      samplePlan.name = 'プラン１';
      samplePlan.theme = PlanTheme.SEA;
      this.plans.push(samplePlan);
    }
  }

  toDetail(plan: Plan) {
    this.navi.element.pushPage(PlanDetailComponent, {data: plan});
  }

  alert() {
    ons.notification.alert('Hello, world!');
  }

  confirm() {
    ons.notification.confirm({
      message: 'This dialog can be canceled by tapping the background or using the back button on your device.',
      cancelable: true,
      callback: i => {
        if (i == -1) {
          ons.notification.alert({message: 'You canceled it!'});
        }
      }
    });
  }

  prompt() {
    ons.notification.prompt({
      message: 'What is the meaning of Life, the Universe and Everything?',
      callback: answer => {
        if (answer === '42') {
          ons.notification.alert({message: 'That\'s the correct answer!'});
        } else {
          ons.notification.alert({message: 'Incorrect! Please try again!'});
        }
      }
    });
  }

  toast() {
    ons.notification.toast('Hello, world!', {timeout: 2000});
  }
}