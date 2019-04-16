import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { v4 as uuid } from 'uuid';

import { Plan } from '../entity/plan';
import { PlanTheme } from '../entity/plan-theme';
import { Schedule } from '../entity/schedule';
import { ScheduleRowMoving } from '../entity/schedule-row-moving';
import { ScheduleRowPlace } from '../entity/schedule-row-place';
import { ViechleType } from '../entity/viechle-type';

@Injectable()
export class PlanService {
  constructor(
    private afs: AngularFirestore
  ) {}

  static fromLocal(): Array<Plan> {
    return JSON.parse(localStorage.getItem('plans'));
  }
  static toLocal(plans: Array<Plan>): void {
    localStorage.setItem('plans', JSON.stringify(plans));
  }
  static getId(): string {
    const deviceId = (window['device'] && window['device'].uuid) || '';
    return deviceId + ':' + uuid();
  }

  createNewPlan(name: string): Promise<Plan> {
    const p = new Plan();
    p.id = PlanService.getId();
    p.name = name;
    p.theme = PlanTheme.CAFE;
    this.savePlan(p);
    return Promise.resolve(p);
  }
  createSharedPlan(sharedId: string): Promise<Plan> {
    return this.afs.collection('plans').doc(sharedId).get()
      .pipe(
        map(doc => doc.data().data),
        map(data => {
          const plan = JSON.parse(data);
          this.savePlan(plan);
          return Plan.parse(JSON.parse(data));
        })
      ).toPromise();
  }
  getPlans(): Promise<Plan[]> {
    // プランが保存されていればそれを返却する
    const plans = PlanService.fromLocal();
    if (plans) {
      plans.map(plan => Plan.parse(plan));
      return Promise.resolve(plans);
    }
    // まだプランが保存されてなければサンプルを保存しつつ返却する
    const samplePlan = this.getSamplePlan();
    this.savePlan(samplePlan);
    return Promise.resolve([samplePlan]);
  }
  savePlan(newPlan: Plan, savingItems?: Array<keyof Plan>) {
    const plans = PlanService.fromLocal();
    // 保存されているものがなければ、そのまま保存
    if (!plans) {
      PlanService.toLocal([newPlan]);
      return;
    }
    // 保存されているものがあれば、IDの一致するプランの項目を書き換える
    const newPlans = plans.map(plan => {
      if (plan.id !== newPlan.id) {
        return plan;
      }
      savingItems.forEach(item => {
        plan[item] = newPlan[item];
      });
      return plan;
    });
    PlanService.toLocal(newPlans);
  }

  private getSamplePlan(): Plan {
    const p = new Plan();
    p.id = PlanService.getId();
    p.name = '一泊二日の大阪旅行 in 2019/03/03';
    p.theme = PlanTheme.OSAKA;
    p.fromYmd = '2019/02/19';
    p.baggage = 'くつした\nシャンプー\n折り畳み傘';

    p.schedules.push(new Schedule('1日目'));
    p.schedules[0].rows.push((() => {
      const row = new ScheduleRowPlace();
      row.fromTime = row.toTime = '07:00';
      row.description = '起床';
      return row;
    })());
    p.schedules[0].rows.push((() => {
      const row = new ScheduleRowPlace();
      row.fromTime = row.toTime = '08:30';
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
      row.fromTime = row.toTime = '09:10';
      row.toTime = '09:13';
      row.description = '新大阪駅';
      row.address = '新大阪駅';
      row.lat = 34.7334658;
      row.lng = 135.50025470000003;
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
      row.fromTime = row.toTime = '09:46';
      row.description = 'ユニバーサルシティ駅';
      row.address = 'ユニバーサルシティ駅';
      row.lat = 34.6678388;
      row.lng = 135.43855380000002;
      return row;
    })());

    p.schedules.push(new Schedule('1日目 (雨用プラン)'));
    p.schedules[1].rows.push((() => {
      const row = new ScheduleRowPlace();
      row.fromTime = row.toTime = '09:30';
      row.description = '起床';
      return row;
    })());
    p.schedules[1].rows.push((() => {
      const row = new ScheduleRowPlace();
      row.fromTime = row.toTime = '11:00';
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
      row.fromTime = row.toTime = '11:20';
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
      row.fromTime = row.toTime = '11:30';
      row.description = '新宿駅';
      return row;
    })());

    return p;
  }
}
