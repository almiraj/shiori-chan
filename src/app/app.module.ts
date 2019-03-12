import { enableProdMode, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { OnsenModule } from 'ngx-onsenui';
import { environment } from '../environments/environment';

import { ThemeImgPipe } from './pipe/theme-img.pipe';
import { AppComponent } from './component/app.component';
import { PlanComponent } from './component/plan.component';
import { PlanDetailComponent } from './component/plan-detai.component';
import { ScheduleRowComponent } from './component/schedule-row.component';
import { EnumUtil } from './service/enum-util.service';
import { PlanService } from './service/plan.service';

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
    ThemeImgPipe,
    AppComponent,
    PlanComponent,
    PlanDetailComponent,
    ScheduleRowComponent,
  ],
  providers: [
    EnumUtil,
    PlanService,
  ],
  entryComponents: [
    PlanComponent,
    PlanDetailComponent,
    ScheduleRowComponent,
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
