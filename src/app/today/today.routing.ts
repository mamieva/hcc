import { Routes } from '@angular/router';

import { TodayComponent } from './today.component';

export const TodayRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: TodayComponent
    }]
}
];
