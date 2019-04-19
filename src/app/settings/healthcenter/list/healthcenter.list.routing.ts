import { Routes } from '@angular/router';

import { HealthcenterListComponent } from './healthcenter.list.component';

export const HealthcenterListRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: HealthcenterListComponent
    }]
}
];
