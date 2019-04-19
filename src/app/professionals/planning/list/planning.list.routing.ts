import { Routes } from '@angular/router';

import { PlanningListComponent } from './planning.list.component';

export const PlanningListRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: PlanningListComponent
    }]
}
];
