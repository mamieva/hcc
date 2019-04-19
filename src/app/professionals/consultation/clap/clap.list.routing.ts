import { Routes } from '@angular/router';

import { ClapListComponent } from './clap.list.component';

export const ClapListRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: ClapListComponent
    }]
}
];
