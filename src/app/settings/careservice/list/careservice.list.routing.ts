import { Routes } from '@angular/router';

import { CareserviceListComponent } from './careservice.list.component';

export const CareserviceListRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: CareserviceListComponent
    }]
}
];
