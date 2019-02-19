import { Injectable } from '@angular/core';

import { Plan } from '../entity/plan';
import { PlanTheme } from '../entity/plan-theme';

@Injectable()
export class PlanService {
  constructor(
  ) {}

  async getPlans(): Promise<Plan> {
    const uuid = window['device'] ? window['device'].uuid : 'TEST_UUID';

    const samplePlan = new Plan();
    samplePlan.name = 'プラン１';
    samplePlan.theme = PlanTheme.SEA;
    return Promise.resolve(samplePlan);
  }
}
