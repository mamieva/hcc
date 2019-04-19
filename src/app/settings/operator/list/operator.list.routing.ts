import { Routes } from '@angular/router';

import { OperatorListComponent } from './operator.list.component';

export const OperatorListRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: OperatorListComponent
    }]
}
];
