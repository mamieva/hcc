import { Routes } from '@angular/router';

import { ProfessionalListComponent } from './professional.list.component';

export const ProfessionalListRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: ProfessionalListComponent
    }]
}
];
