import { Injectable } from 'ngx-onsenui';
import { PlanService } from './plan.service';
import { Plan } from '../entity/plan';

@Injectable()
export class EditModeService {
  on = false;
  off = true;
  plan: Plan;
  savingItems: Array<keyof Plan>;

  constructor(
    private planService: PlanService
  ) {}

  setSavingItem(plan: Plan, ...items: Array<keyof Plan>) {
    this.plan = plan;
    this.savingItems = items;
  }
  toggle() {
    this.on = !this.on;
    this.off = !this.off;
    if (this.off) {
      this.planService.savePlan(this.plan, this.savingItems);
    }
  }
}
