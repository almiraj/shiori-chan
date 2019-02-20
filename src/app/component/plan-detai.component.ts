import { Component, OnsNavigator, Params, ViewChild, ElementRef } from 'ngx-onsenui';
import * as ons from 'onsenui';

import { PlanComponent } from './plan.component';
import { Plan } from '../entity/plan';
import { Schedule } from '../entity/schedule';
import { FormGroup, FormControl } from '@angular/forms';

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
          <div class="title">{{plan.name}}</div>
        </ons-card>
        <ons-card>
          <div class="title">持ち物・メモ書き</div>
          <div class="content pre">{{plan.baggage}}</div>
        </ons-card>
        <div class="content">
          <ons-carousel-cover>
            <div id="carousel-button">
              <label class="radio-button radio-button--material" *ngFor="let schedule of plan.schedules; let i = index">
                <ons-radio name="schedules" modifier="material" (change)="swipeSchedule(i)"
                  name="scheduleIdx" [attr.value]="i" [checked]="i == scheduleIdx"></ons-radio>
              </label>
            </div>
          </ons-carousel-cover>
          <ons-carousel #carousel fullscreen swipeable auto-scroll overscrollable (postchange)="selectSchedule()">
            <ons-carousel-item *ngFor="let schedule of plan.schedules; let i = index">
              <ons-card>
                <div class="title">{{schedule.name}}</div>
                <div class="content">
                  <ons-list>
                    <ons-list-item *ngFor="let row of schedule.rows; let i = index"
                        [ngClass]="{'moving': row.isMoving}">
                      <div *ngIf="!row.isMoving">
                        {{row.fromTime}}
                        <div *ngIf="row.toTime">～{{row.toTime}}</div>
                        {{row.description}}
                        <p class="memo pre">{{row.memo}}</p>
                      </div>
                      <div *ngIf="row.isMoving">
                        {{row.description}}
                        <span *ngIf="row.interval"> ({{row.interval}})</span>
                        <p class="memo pre">{{row.memo}}</p>
                        </div>
                    </ons-list-item>
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
    '.pre { white-space: pre-wrap; }',
    'ons-carousel { margin-bottom: 100%; }',
    '#carousel-button { text-align: center; }',
    '#carousel-button .radio-button { display: inline-block; margin-right: 0.1em; margin-left: 0.1em; }',
    '.moving { border-left: 2px solid #ccc; }',
    '.memo { font-size: 0.8em; }',
  ]
})
export class PlanDetailComponent {
  @ViewChild('carousel') carousel: ElementRef;
  plan: Plan;
  scheduleIdx = 0;

  constructor(navigator: OnsNavigator, params: Params) {
    this.plan = params.data;
  }

  swipeSchedule(i: number) {
    this.carousel.nativeElement.setActiveIndex(i);
  }

  selectSchedule() {
    this.scheduleIdx = this.carousel.nativeElement.getActiveIndex();
  }

  alert() {
    ons.notification.alert('Hello, world!');
  }

  confirm() {
    ons.notification.confirm({
      message: 'This dialog can be canceled by tapping the background or using the back button on your device.',
      cancelable: true,
      callback: i => {
        if (i === -1) {
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