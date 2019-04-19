import { Routes } from '@angular/router';

import { InterconsultComponent } from './interconsult.component';

export const InterconsultRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: InterconsultComponent
    }]
}
];
