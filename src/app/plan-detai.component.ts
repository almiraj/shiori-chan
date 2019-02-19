import { Component, OnsNavigator, Params } from 'ngx-onsenui';
import * as ons from 'onsenui';

import { Plan } from './entity/plan';
import { PlanComponent } from './plan.component';

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
          <ons-toolbar-button (click)="confirm()">share</ons-toolbar-button>
        </div>
      </ons-toolbar>
      <div class="content">
        <ons-card>
          <img src="https://monaca.io/img/logos/download_image_onsenui_01.png" alt="Onsen UI" style="width: 100%">
          <div class="title">
            {{plan.name}}
          </div>
        </ons-card>
        <ons-card>
          <div class="title">
            持ち物
          </div>
          <textarea class="textarea" rows="3"></textarea>
        </ons-card>

        <ons-list>
          <ons-list-header>{{plan.name}}</ons-list-header>
          <ons-list-item tappable (click)="confirm()">Confirmation</ons-list-item>
          <ons-list-item tappable (click)="prompt()">Prompt</ons-list-item>
          <ons-list-item tappable (click)="toast()">Toast</ons-list-item>

          <ons-list-header>Components</ons-list-header>
          <ons-list-item tappable (click)="dialog.show()">Simple Dialog</ons-list-item>
          <ons-list-item tappable (click)="alertDialog.show()">Alert Dialog</ons-list-item>

          <ons-list-header>Components</ons-list-header>
          <ons-list-item tappable (click)="dialog.show()">Simple Dialog</ons-list-item>
          <ons-list-item tappable (click)="alertDialog.show()">Alert Dialog</ons-list-item>

          <ons-list-header>Components</ons-list-header>
          <ons-list-item tappable (click)="dialog.show()">Simple Dialog</ons-list-item>
          <ons-list-item tappable (click)="alertDialog.show()">Alert Dialog</ons-list-item>

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
export class PlanDetailComponent {
  plan: Plan;

  constructor(navigator: OnsNavigator, params: Params) {
    this.plan = params.data;
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