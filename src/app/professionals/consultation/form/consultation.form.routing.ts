import { Routes } from '@angular/router';

import { ConsultationFormComponent } from './consultation.form.component';

export const ConsultationFormRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: ConsultationFormComponent
    }]
}
];
