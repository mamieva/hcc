import { Routes } from '@angular/router';

import { HealthcenterFormComponent } from './healthcenter.form.component';

export const HealthcenterFormRoutes: Routes = [
    {
      path: '',
      children: [ {
        path: '',
        component: HealthcenterFormComponent
    }]
}
];
