import { Routes } from '@angular/router';

import { ProfileListComponent } from './profile.list.component';

export const ProfileListRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: ProfileListComponent
    }]
}
];
