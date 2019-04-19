import { Routes } from '@angular/router';

import { PatienceFormComponent } from './patience.form.component';

export const PatienceFormRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: PatienceFormComponent
    }]
}
];
