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
        <ons-card #buggage>
          <div *ngIf="!buggage.isEdit" class="pencil" (click)="buggage.isEdit = !buggage.isEdit">
            <i class="fas fa-pencil-alt"></i>
          </div>
          <div *ngIf="buggage.isEdit" class="pencil envelope" (click)="buggage.isEdit = !buggage.isEdit">
            <i class="fas fa-envelope"></i>
          </div>
          <div class="title">持ち物・メモ書き</div>
          <div class="content toggleArea">
            <div *ngIf="buggage.isEdit" style="position: absolute; width: 100%; height: 100%;">
              <textarea [(ngModel)]="plan.baggage"></textarea>
            </div>
            <div class="content pre">{{plan.baggage}}</div>
          </div>
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
              <ons-card #sche>
                <div *ngIf="!sche.isEdit" class="pencil" (click)="sche.isEdit = !sche.isEdit">
                  <i class="fas fa-pencil-alt"></i>
                </div>
                <div *ngIf="sche.isEdit" class="pencil envelope" (click)="sche.isEdit = !sche.isEdit">
                  <i class="fas fa-envelope"></i>
                </div>
                <div class="title">{{schedule.name}}</div>
                <div class="content">
                  <ons-list>
                    <div *ngFor="let row of schedule.rows; let i = index">
                      <app-schedule-row [row]="row" [isEdit]="sche.isEdit"></app-schedule-row>
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
    'ons-card { position: relative; padding-bottom: 20px; }',
    'ons-card > .pencil { position: absolute; top: 6px; right: 6px; font-size: 1.2em; color: #0076ff; }',
    'ons-card > .envelope { color: #ff1a33; }',
    '.toggleArea { position: relative; }',
    '.toggleArea textarea { width: 100%; height: 100%; margin: 0; padding: 0; border-width: 0 4px 0 0; border-color: #ff1a33; }',
    '.toggleArea textarea { font-family: -apple-system, "Helvetica Neue", "Helvetica", "Arial", "Lucida Grande", sans-serif; }',
    '.pre { white-space: pre-wrap; }',
    'ons-carousel { margin-bottom: 100%; }',
    '#carousel-button { text-align: center; }',
    '#carousel-button .radio-button { display: inline-block; margin-right: 0.1em; margin-left: 0.1em; }',
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