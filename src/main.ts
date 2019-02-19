// Application code starts here
import { enableProdMode, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClientModule } from '@angular/common/http';
import { OnsenModule } from 'ngx-onsenui';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { PlanComponent } from './app/plan.component';
import { PlanDetailComponent } from './app/plan-detai.component';

// Enable production mode when in production mode.
if (environment.production) {
  enableProdMode();
}

@NgModule({
  imports: [
    OnsenModule, // has BrowserModule internally
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
class AppModule {}

// if (module['hot']) module['hot'].accept();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
