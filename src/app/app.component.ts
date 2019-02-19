import { Component, ViewChild } from '@angular/core';
import { OnsSplitterContent, OnsSplitterSide } from 'ngx-onsenui';

import { PlanComponent } from './plan.component';

@Component({
  selector: 'app-component',
  template: `
    <ons-navigator swipeable [page]="page"></ons-navigator>
  `,
  styles: []
})
export class AppComponent {
  page = PlanComponent;
}
