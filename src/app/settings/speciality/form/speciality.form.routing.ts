import { Routes } from '@angular/router';

import { SpecialityFormComponent } from './speciality.form.component';

export const SpecialityFormRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: SpecialityFormComponent
    }]
}
];
