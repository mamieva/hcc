import { Routes } from '@angular/router';

import { OperatorFormComponent } from './operator.form.component';

export const OperatorFormRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: OperatorFormComponent
    }]
}
];
