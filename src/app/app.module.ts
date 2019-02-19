import { enableProdMode, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { OnsenModule } from 'ngx-onsenui';

import { environment } from '../environments/environment';
import { AppComponent } from '../app/app.component';
import { PlanComponent } from '../app/plan.component';
import { PlanDetailComponent } from '../app/plan-detai.component';

if (environment.production) {
  enableProdMode();
}

@NgModule({
  imports: [
    OnsenModule,
    HttpClientModule,
  ],
  declarations: [
    AppComponent,
    PlanComponent,
    PlanDetailComponent,
  ],
  entryComponents: [
    PlanComponent,
    PlanDetailComponent,
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
