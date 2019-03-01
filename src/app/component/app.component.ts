import { Component } from '@angular/core';

import { PlanComponent } from './plan.component';

@Component({
  selector: 'app-root',
  template: `
    <ons-navigator swipeable [page]="page"></ons-navigator>
  `,
  styles: []
})
export class AppComponent {
  page = PlanComponent;
}
