import { Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LockComponent } from './lock/lock.component';
import { LoginComponent } from './login/login.component';
import { CipeLoginComponent } from './login/cipe.login.component';
import { AccessComponent } from './access/access.component';

export const PagesRoutes: Routes = [

    {
        path: '',
        children: [ {
            path: 'login',
            component: LoginComponent
        }, {
            path: 'cipelogin',
            component: CipeLoginComponent
        }, {
            path: 'access',
            component: AccessComponent
        }, {
            path: 'lock',
            component: LockComponent
        }, {
            path: 'register',
            component: RegisterComponent
        }]
    }
];
