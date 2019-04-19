import { Routes } from '@angular/router';

import { ProfessionalFormComponent } from './professional.form.component';

export const ProfessionalFormRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: ProfessionalFormComponent
    }]
}
];
