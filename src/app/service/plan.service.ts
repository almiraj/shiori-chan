import { Injectable } from '@angular/core';

import { Plan } from '../entity/plan';
import { PlanTheme } from '../entity/plan-theme';
import { Schedule } from '../entity/schedule';
import { ScheduleRowMoving } from '../entity/schedule-row-moving';
import { ScheduleRowPlace } from '../entity/schedule-row-place';
import { ViechleType } from '../entity/viechle-type';

@Injectable()
export class PlanService {
  constructor(
  ) {}

  createPlan(name: string): Promise<Plan> {
    const p = new Plan();
    p.id = 'asdfasdf';
    p.name = name;
    p.theme = PlanTheme.SEA;
    return Promise.resolve(p);
  }

  getPlans(): Promise<Plan[]> {
    const uuid = window['device'] ? window['device'].uuid : 'TEST_UUID';

    return Promise.resolve([this.getSamplePlan()]);
  }

  getPlan(id: String): Promise<Plan> {
    const uuid = window['device'] ? window['device'].uuid : 'TEST_UUID';

    return Promise.resolve(this.getSamplePlan());
  }

  private getSamplePlan(): Plan {
    const p = new Plan();
    p.name = 'プラン１';
    p.theme = PlanTheme.SEA;
    p.fromYmd = '2019/02/19';
    p.baggage = 'くつした\nシャンプー\n折り畳み傘';

    p.schedules.push(new Schedule('1日目'));
    p.schedules[0].rows.push((() => {
      const row = new ScheduleRowPlace();
      row.fromTime = '07:00';
      row.description = '起床';
      return row;
    })());
    p.schedules[0].rows.push((() => {
      const row = new ScheduleRowPlace();
      row.fromTime = '08:30';
      row.description = '家を出る';
      row.memo = '持ち物を忘れないように\n最悪でも11:15には出ること';
      return row;
    })());
    p.schedules[0].rows.push((() => {
      const row = new ScheduleRowMoving();
      row.viechleType = ViechleType.WALK;
      row.interval = '01:10';
      return row;
    })());
    p.schedules[0].rows.push((() => {
      const row = new ScheduleRowPlace();
      row.fromTime = '09:10';
      row.toTime = '09:13';
      row.description = '新大阪駅';
      row.url = 'https://www.google.com/maps/place/%E6%96%B0%E5%A4%A7%E9%98%AA%E9%A7%85/@34.7334658,135.5002547,15z/'
        + 'data=!4m5!3m4!1s0x0:0x3bd7c4e0bf1076cf!8m2!3d34.7334658!4d135.5002547';
      return row;
    })());
    p.schedules[0].rows.push((() => {
      const row = new ScheduleRowMoving();
      row.viechleType = ViechleType.TRAIN;
      row.memo = '大阪駅で乗り換え';
      row.interval = '00:15';
      row.viechleType = ViechleType.TRAIN;
      row.url = 'https://transit.yahoo.co.jp/search/result?flatlon=&from=%E6%96%B0%E5%A4%A7%E9%98%AA&tlatlon='
        + '&to=USJ&viacode=&via=&viacode=&via=&viacode=&via=&y=2019&m=02&d=21&hh=09&m2=3&m1=0&type=1&ticket='
        + 'ic&expkind=1&ws=3&s=0&al=1&shin=1&ex=1&hb=1&lb=1&sr=1&kw=USJ';
      return row;
    })());
    p.schedules[0].rows.push((() => {
      const row = new ScheduleRowPlace();
      row.fromTime = '09:46';
      row.description = 'ユニバーサルシティ駅';
      row.url = 'https://www.google.com/maps/place/%E3%83%A6%E3%83%8B%E3%83%90%E3%83%BC%E3%82%B5%E3%83%'
        + 'AB%E3%82%B7%E3%83%86%E3%82%A3%E9%A7%85/@34.6678432,135.4363651,17z/data=!3m1!4b1!4m5!3m4!'
        + '1s0x6000e890dcaf65db:0x44b3a88239419885!8m2!3d34.6678388!4d135.4385538';
      return row;
    })());

    p.schedules.push(new Schedule('1日目 (雨用プラン)'));
    p.schedules[1].rows.push((() => {
      const row = new ScheduleRowPlace();
      row.fromTime = '09:30';
      row.description = '起床';
      return row;
    })());
    p.schedules[1].rows.push((() => {
      const row = new ScheduleRowPlace();
      row.fromTime = '11:00';
      row.description = '家を出る';
      return row;
    })());
    p.schedules[1].rows.push((() => {
      const row = new ScheduleRowMoving();
      row.viechleType = ViechleType.WALK;
      row.interval = '20分';
      return row;
    })());
    p.schedules[1].rows.push((() => {
      const row = new ScheduleRowPlace();
      row.fromTime = '11:20';
      row.description = '小川町駅';
      return row;
    })());
    p.schedules[1].rows.push((() => {
      const row = new ScheduleRowMoving();
      row.url = 'https://transit.yahoo.co.jp/search/result?flatlon=&from=%E5%B0%8F%E5%B7%9D%E7%94%BA&tlatlon='
        + '&to=%E6%96%B0%E5%AE%BF&viacode=&via=&viacode=&via=&viacode=&via=&y=2019&m=02&d=19&hh=15&m2=3&m1=0&'
        + 'type=1&ticket=ic&expkind=1&ws=3&row=0&al=1&shin=1&ex=1&hb=1&lb=1&sr=1&kw=%E6%96%B0%E5%AE%BF';
      row.viechleType = ViechleType.TRAIN;
      row.interval = '20分';
      return row;
    })());
    p.schedules[1].rows.push((() => {
      const row = new ScheduleRowPlace();
      row.fromTime = '11:30';
      row.description = '新宿駅';
      return row;
    })());

    return p;
  }
}
