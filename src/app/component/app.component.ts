import { Component } from '@angular/core';

import { PlanListComponent } from './plan-list.component';

@Component({
  selector: 'app-root',
  template: `
    <ons-navigator swipeable [page]="page"></ons-navigator>
  `,
  styles: []
})
export class AppComponent {
  page = PlanListComponent;
}
