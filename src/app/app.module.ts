/// <reference types="@types/googlemaps" />

import { enableProdMode, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { OnsenModule } from 'ngx-onsenui';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../environments/environment';

import { ThemeImgPipe } from './pipe/theme-img.pipe';
import { AppComponent } from './component/app.component';
import { PlanListComponent } from './component/plan-list.component';
import { PlanDetailComponent } from './component/plan-detai.component';
import { ScheduleRowComponent } from './component/schedule-row.component';
import { EnumUtil } from './service/enum-util.service';
import { PlanService } from './service/plan.service';
import { MapComponent } from './component/map.component';
import { MapDirectionComponent, MapDirectionInnerComponent } from './component/map-direction.component';

if (environment.production) {
  enableProdMode();
}

@NgModule({
  imports: [
    OnsenModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDp3nJwrIGEGFfmlPPP_iaN-fuDRkMxou8',
      libraries: [ 'places', 'directions' ]
    }),
  ],
  declarations: [
    ThemeImgPipe,
    AppComponent,
    PlanListComponent,
    PlanDetailComponent,
    ScheduleRowComponent,
    MapComponent,
    MapDirectionComponent,
    MapDirectionInnerComponent,
  ],
  providers: [
    EnumUtil,
    PlanService,
  ],
  entryComponents: [
    PlanListComponent,
    PlanDetailComponent,
    ScheduleRowComponent,
    MapComponent,
    MapDirectionComponent,
    MapDirectionInnerComponent,
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
