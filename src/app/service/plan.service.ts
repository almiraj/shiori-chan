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
    p.schedules = [];
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

    p.schedules = [new Schedule(), new Schedule()];

    p.schedules[0].name = '1日目';
    p.schedules[0].rows = [];
    p.schedules[0].rows.push((() => {
      const row = new ScheduleRowPlace();
      row.fromTime = '09:30';
      row.description = '起床';
      return row;
    })());
    p.schedules[0].rows.push((() => {
      const row = new ScheduleRowPlace();
      row.fromTime = '11:00';
      row.description = '家を出る';
      return row;
    })());
    p.schedules[0].rows.push((() => {
      const row = new ScheduleRowMoving();
      row.description = '徒歩';
      return row;
    })());
    p.schedules[0].rows.push((() => {
      const row = new ScheduleRowPlace();
      row.fromTime = '11:20';
      row.description = '小川町駅';
      return row;
    })());
    p.schedules[0].rows.push((() => {
      const row = new ScheduleRowMoving();
      row.description = '都営新宿線';
      row.viechle = ViechleType.TRAIN;
      row.url = 'https://transit.yahoo.co.jp/search/result?flatlon=&from=%E5%B0%8F%E5%B7%9D%E7%94%BA&tlatlon=&to=%E6%96%B0%E5%AE%BF&viacode=&via=&viacode=&via=&viacode=&via=&y=2019&m=02&d=19&hh=15&m2=3&m1=0&type=1&ticket=ic&expkind=1&ws=3&row=0&al=1&shin=1&ex=1&hb=1&lb=1&sr=1&kw=%E6%96%B0%E5%AE%BF';
      return row;
    })());
    p.schedules[0].rows.push((() => {
      const row = new ScheduleRowPlace();
      row.fromTime = '11:30';
      row.description = '新宿駅';
      return row;
    })());

    p.schedules[1].name = '1日目 (雨用プラン)';
    p.schedules[1].rows = [];
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
      row.description = '徒歩';
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
      row.description = '都営新宿線';
      row.viechle = ViechleType.TRAIN;
      row.url = 'https://transit.yahoo.co.jp/search/result?flatlon=&from=%E5%B0%8F%E5%B7%9D%E7%94%BA&tlatlon=&to=%E6%96%B0%E5%AE%BF&viacode=&via=&viacode=&via=&viacode=&via=&y=2019&m=02&d=19&hh=15&m2=3&m1=0&type=1&ticket=ic&expkind=1&ws=3&row=0&al=1&shin=1&ex=1&hb=1&lb=1&sr=1&kw=%E6%96%B0%E5%AE%BF';
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
