import { Routes } from '@angular/router';

import { SpecialityListComponent } from './speciality.list.component';

export const SpecialityListRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: SpecialityListComponent
    }]
}
];
