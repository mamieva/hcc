import { Routes } from '@angular/router';

import { ServicehourComponent } from './servicehour.component';

export const ServicehourRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: ServicehourComponent
    }]
}
];
