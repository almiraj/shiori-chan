import { Injectable } from '@angular/core';
import { map, filter } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { v4 as uuid } from 'uuid';

import { Plan } from '../entity/plan';
import { PlanTheme } from '../constant/plan-theme';

@Injectable()
export class PlanService {
  constructor(
    private afs: AngularFirestore
  ) {}

  static toThemeImgPathes(plans: Array<Plan>): Array<PlanTheme> {
    const imgPathes = [];
    for (const p of plans) {
      imgPathes.push('./assets/' + p.theme.name + '.jpg');
    }
    return imgPathes;
  }

  private fromLocal(): Array<Plan> {
    return JSON.parse(localStorage.getItem('plans'));
  }
  private toLocal(plans: Array<Plan>): void {
    localStorage.setItem('plans', JSON.stringify(plans));
  }
  private getPlanId(): string {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = uuid();
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId + ':' + uuid();
  }

  createNewPlan(name: string): Promise<Plan> {
    const p = new Plan();
    p.id = this.getPlanId();
    p.name = name;
    p.theme = PlanTheme.CAFE;
    return Promise.resolve(p);
  }
  createSharedPlan(sharedId: string): Promise<Plan> {
    return new Promise((resolve, reject) => {
      this.afs.collection('plans').doc(sharedId).get()
        .subscribe(
          doc => {
            if (!doc.exists) {
              return reject('存在しない共有IDです');
            }
            return resolve(Plan.parse(JSON.parse(doc.data().data)));
          },
          e => reject(e)
        );
    });
  }
  getPlans(): Promise<Plan[]> {
    // プランが保存されていればそれを返却する
    const plans = this.fromLocal();
    if (plans) {
      plans.map(plan => Plan.parse(plan));
      return Promise.resolve(plans);
    }
    // まだプランが保存されてなければサンプルを保存しつつ返却する
    const samplePlans = this.getSamplePlans();
    this.saveAllPlan(samplePlans);
    return Promise.resolve(samplePlans);
  }
  addPlan(newPlan: Plan): boolean {
    const plans = this.fromLocal();
    // 保存されているものがなければ、そのまま保存
    if (!plans) {
      this.toLocal([newPlan]);
      return true;
    }
      // 既に存在する場合は、保存せずに終わる
    if (plans.filter(plan => (plan.id === newPlan.id)).length !== 0) {
      return false;
    }
    plans.unshift(newPlan);
    this.toLocal(plans);
    return true;
  }
  overwritePlan(newPlan: Plan): void {
    const plans = this.fromLocal();
    let isOverwritten = false;
    const newPlans = plans.map(plan => {
      if (plan.id !== newPlan.id) {
        return plan;
      }
      isOverwritten = true;
      return newPlan;
    });
    if (!isOverwritten) {
      throw new Error('上書きできませんでした');
    }
    this.toLocal(newPlans);
  }
  savePlan(newPlan: Plan, savingItems?: Array<keyof Plan>): void {
    const plans = this.fromLocal();
    // 保存されているものがなければ、そのまま保存
    if (!plans) {
      this.toLocal([newPlan]);
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
    this.toLocal(newPlans);
  }
  saveAllPlan(plans: Plan[]) {
    this.toLocal(plans);
  }

  private getSamplePlans(): Array<Plan> {
    return [Plan.parse({
      'schedules': [
        {
          'name': '1日目',
          'rows': [
            {
              'isMoving': false,
              'description': '起床',
              'toTime': '07:00',
              'fromTime': '07:00'
            },
            {
              'isMoving': false,
              'description': '家を出る',
              'toTime': '08:30',
              'fromTime': '08:30',
              'memo': '持ち物を忘れないように\n最悪でも11:15には出ること',
              'latLng': { 'lat': 34.88797414008486, 'lng': 135.4159649680705 },
              'address': ''
            },
            { 'isMoving': true, 'interval': '00:10', 'viechleType': 'WALK' },
            {
              'isMoving': false,
              'description': '畦野駅',
              'address': '畦野駅',
              'latLng': { 'lat': 34.88506580000001, 'lng': 135.4156395 },
              'fromTime': '08:40',
              'toTime': '08:40'
            },
            {
              'isMoving': true,
              'interval': '01:15',
              'viechleType': 'TRAIN',
              'memo': '川西能勢口で乗り換え'
            },
            {
              'isMoving': false,
              'description': 'ユニバーサルシティ駅',
              'toTime': '09:45',
              'fromTime': '09:45',
              'address': 'ユニバーサルシティ駅',
              'latLng': { 'lat': 34.6678388, 'lng': 135.43855380000002 }
            },
            {
              'isMoving': true,
              'interval': '00:10',
              'viechleType': 'WALK',
              'memo': ''
            },
            {
              'isMoving': false,
              'description': 'ユニバーサルスタジオ',
              'address': 'ユニバーサル・スタジオ・ジャパン',
              'latLng': { 'lat': 34.665442, 'lng': 135.4323382 },
              'fromTime': '10:00',
              'toTime': '20:00',
              'memo': '12:00に昼ご飯\n18:00に夕ご飯'
            },
            { 'isMoving': true, 'interval': '00:10', 'viechleType': 'WALK' },
            {
              'isMoving': false,
              'description': 'ユニバーサルポート',
              'address': 'ホテル ユニバーサル ポート',
              'latLng': { 'lat': 34.666121, 'lng': 135.43775600000004 },
              'fromTime': '20:15',
              'toTime': '23:00',
              'memo': ''
            },
            {
              'isMoving': false,
              'description': '就寝',
              'fromTime': '23:00',
              'toTime': '23:00'
            }
          ]
        },
        {
          'name': '2日目',
          'rows': [
            {
              'isMoving': false,
              'description': '朝ご飯',
              'toTime': '07:30',
              'fromTime': '07:30',
              'memo': 'ビュッフェ形式'
            },
            {
              'isMoving': false,
              'description': 'ホテルを出る',
              'toTime': '09:20',
              'fromTime': '09:20',
              'latLng': { 'lat': 34.666121, 'lng': 135.43775600000004 },
              'address': 'ホテル ユニバーサル ポート'
            },
            { 'isMoving': true, 'interval': '00:10', 'viechleType': 'WALK' },
            {
              'isMoving': false,
              'description': 'ユニバーサルシティ駅',
              'toTime': '09:30',
              'fromTime': '09:30',
              'latLng': { 'lat': 34.6678388, 'lng': 135.43855380000002 },
              'address': 'ユニバーサルシティ駅'
            },
            {
              'isMoving': true,
              'interval': '00:30',
              'viechleType': 'TRAIN'
            },
            {
              'isMoving': false,
              'description': 'なんば駅',
              'toTime': '10:00',
              'fromTime': '10:00',
              'latLng': { 'lat': 34.6670718, 'lng': 135.5003607 },
              'address': 'なんば駅',
              'memo': 'ちょっと散策'
            },
            {
              'isMoving': false,
              'description': 'グランド花月',
              'fromTime': '11:00',
              'toTime': '14:00',
              'memo': '終わったらたこ焼き食べる',
              'address': 'よしもと なんばグランド花月 劇場（ＮＧＫ）',
              'latLng': { 'lat': 34.66498689999999, 'lng': 135.5036556 }
            },
            { 'isMoving': true, 'interval': '00:17', 'viechleType': 'TRAIN' },
            {
              'isMoving': false,
              'description': '森ノ宮駅',
              'address': '森ノ宮駅',
              'latLng': { 'lat': 34.6817307, 'lng': 135.5333561 },
              'fromTime': '14:17',
              'toTime': '14:17'
            },
            {
              'isMoving': false,
              'description': '大阪城',
              'address': '大阪城',
              'latLng': { 'lat': 34.6873333, 'lng': 135.5259555 },
              'fromTime': '14:30',
              'toTime': '16:30',
              'memo': '金の茶室を見る'
            },
            {
              'isMoving': false,
              'description': '森ノ宮駅',
              'address': '森ノ宮駅',
              'latLng': { 'lat': 34.6817307, 'lng': 135.5333561 },
              'fromTime': '16:40',
              'toTime': '16:40'
            },
            { 'isMoving': true, 'interval': '00:04', 'viechleType': 'TRAIN' },
            {
              'isMoving': false,
              'description': '京橋',
              'memo': '散策して鉄板焼き食べる',
              'fromTime': '16:44',
              'toTime': '19:00'
            },
            { 'isMoving': true, 'interval': '01:05', 'viechleType': 'TRAIN' },
            {
              'isMoving': false,
              'description': '畦野駅',
              'fromTime': '20:05',
              'toTime': '20:05',
              'address': '畦野駅',
              'latLng': { 'lat': 34.88506580000001, 'lng': 135.4156395 }
            },
            { 'isMoving': true, 'interval': '00:10', 'viechleType': 'WALK' },
            {
              'isMoving': false,
              'description': '帰宅',
              'fromTime': '20:10',
              'toTime': '20:10',
              'address': '',
              'latLng': { 'lat': 34.8881717142625, 'lng': 135.41593990740967 }
            }
          ]
        }
      ],
      'id': 'e1a95c28-d3bf-49b6-a2a1-ce73264e66fb:c636042b-5e17-4dac-a11d-45a196a04938',
      'name': '2019/03/03 一泊二日の大阪旅行',
      'theme': {
        'name': 'OSAKA',
        'idx': 4
      },
      'fromYmd': '2019/02/19',
      'baggage': 'くつした\nシャンプー\n折り畳み傘'
    })];
  }
}
