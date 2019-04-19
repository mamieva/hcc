import { Routes } from '@angular/router';

import { ConsultationListComponent } from './consultation.list.component';

export const ConsultationListRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: ConsultationListComponent
    }]
}
];
