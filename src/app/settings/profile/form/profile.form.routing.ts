import { Routes } from '@angular/router';

import { ProfileFormComponent } from './profile.form.component';

export const ProfileFormRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: ProfileFormComponent
    }]
}
];
