import { Routes } from '@angular/router';

import { CareserviceFormComponent } from './careservice.form.component';

export const CareserviceFormRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: CareserviceFormComponent
    }]
}
];
