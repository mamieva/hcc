import { Routes } from '@angular/router';

import { PatienceListComponent } from './patience.list.component';

export const PatienceListRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: PatienceListComponent
    }]
}
];
