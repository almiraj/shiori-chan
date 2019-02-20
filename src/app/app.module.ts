import { enableProdMode, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { OnsenModule } from 'ngx-onsenui';

import { environment } from '../environments/environment';
import { AppComponent } from './component/app.component';
import { PlanComponent } from './component/plan.component';
import { PlanDetailComponent } from './component/plan-detai.component';
import { PlanService } from './service/plan.service';
import { ScheduleRowPlaceComponent } from './component/schedule-row-place.component';
import { ScheduleRowMovingComponent } from './component/schedule-row-moving.component';

if (environment.production) {
  enableProdMode();
}

@NgModule({
  imports: [
    OnsenModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AppComponent,
    PlanComponent,
    PlanDetailComponent,
    ScheduleRowPlaceComponent,
    ScheduleRowMovingComponent,
  ],
  providers: [
    PlanService,
  ],
  entryComponents: [
    PlanComponent,
    PlanDetailComponent,
    ScheduleRowPlaceComponent,
    ScheduleRowMovingComponent,
  ],
  bootstrap: [
    AppComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
})
export class AppModule {
}
