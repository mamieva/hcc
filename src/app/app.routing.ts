import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

import { SignComponent } from './sign/sign.component';

import { AuthGuard } from './pages/login/auth.guard';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full',
        canActivate: [AuthGuard]
    },
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: 'schedule',
                loadChildren: './schedule/schedule.module#ScheduleModule',
                canActivate: [AuthGuard]
            }, {
                path: 'welcome',
                loadChildren: './userpage/user.module#UserModule',
                canActivate: [AuthGuard]
            }, {
                path: 'interconsult',
                loadChildren: './interconsult/interconsult.module#InterconsultModule',
                canActivate: [AuthGuard]
            }, {
                path: 'interconsult/:docNumberSex/:serviceId',
                loadChildren: './interconsult/interconsult.module#InterconsultModule',
                canActivate: [AuthGuard]
            }, {
                //     path: 'patience',
                //     loadChildren: './schedule/patience/patience.form.module#PatienceFormModule',
                //     canActivate: [AuthGuard]
                // }, {
                path: 'today',
                loadChildren: './today/today.module#TodayModule',
                canActivate: [AuthGuard]
            }, {
                path: 'today/:docNumberSex',
                loadChildren: './today/today.module#TodayModule',
                canActivate: [AuthGuard]
            }, {
                path: 'patiencelist',
                loadChildren: './patience/list/patience.list.module#PatienceListModule',
                canActivate: [AuthGuard]
            }, {
                path: 'patience',
                loadChildren: './patience/form/patience.form.module#PatienceFormModule',
                canActivate: [AuthGuard]
            }, {
                path: 'patience/:id',
                loadChildren: './patience/form/patience.form.module#PatienceFormModule',
                canActivate: [AuthGuard]
            }, {
                path: 'today/:scheduleId/consultation',
                loadChildren: './professionals/consultation/form/consultation.form.module#ConsultationFormModule',
                canActivate: [AuthGuard]
            }, {
                path: 'medicalplanning',
                loadChildren: './professionals/planning/list/planning.list.module#PlanningListModule',
                canActivate: [AuthGuard]
            }, {
                path: 'consultationlist',
                loadChildren: './professionals/consultation/list/consultation.list.module#ConsultationListModule',
                canActivate: [AuthGuard]
            }, {
                path: 'consultation/:id',
                loadChildren: './professionals/consultation/form/consultation.form.module#ConsultationFormModule',
                canActivate: [AuthGuard]
            }, {
                path: 'consultation/clap/:id',
                loadChildren: './professionals/consultation/clap/clap.list.module#ClapListModule',
                canActivate: [AuthGuard]
            }, {
                path: 'consultation/clap/:id/history/:clapId',
                loadChildren: './professionals/consultation/clap/clap.list.module#ClapListModule',
                canActivate: [AuthGuard]
            }, {
                path: 'receipt',
                loadChildren: './reports/receipt/receipt.module#ReceiptModule',
                canActivate: [AuthGuard]
            }, {
                path: 'receiptC2',
                loadChildren: './reports/receiptC2/receiptC2.module#ReceiptC2Module',
                canActivate: [AuthGuard]
            }, {
                path: 'receiptPatience',
                loadChildren: './reports/receiptPatience/receiptPatience.module#ReceiptPatienceModule',
                canActivate: [AuthGuard]
            }, {
                path: 'receiptSchedule',
                loadChildren: './reports/receiptSchedule/receiptSchedule.module#ReceiptScheduleModule',
                canActivate: [AuthGuard]
            }, {
                path: 'healthcenterlist',
                loadChildren: './settings/healthcenter/list/healthcenter.list.module#HealthcenterListModule',
                canActivate: [AuthGuard]
            }, {
                path: 'healthcenter',
                loadChildren: './settings/healthcenter/form/healthcenter.form.module#HealthcenterFormModule',
                canActivate: [AuthGuard]
            }, {
                path: 'healthcenter/:id',
                loadChildren: './settings/healthcenter/form/healthcenter.form.module#HealthcenterFormModule',
                canActivate: [AuthGuard]
            }, {
                path: 'specialitylist',
                loadChildren: './settings/speciality/list/speciality.list.module#SpecialityListModule',
                canActivate: [AuthGuard]
            }, {
                path: 'speciality',
                loadChildren: './settings/speciality/form/speciality.form.module#SpecialityFormModule',
                canActivate: [AuthGuard]
            }, {
                path: 'speciality/:id',
                loadChildren: './settings/speciality/form/speciality.form.module#SpecialityFormModule',
                canActivate: [AuthGuard]
            }, {
                path: 'professionallist',
                loadChildren: './settings/professional/list/professional.list.module#ProfessionalListModule',
                canActivate: [AuthGuard]
            }, {
                path: 'professional',
                loadChildren: './settings/professional/form/professional.form.module#ProfessionalFormModule',
                canActivate: [AuthGuard]
            }, {
                path: 'professional/:id',
                loadChildren: './settings/professional/form/professional.form.module#ProfessionalFormModule',
                canActivate: [AuthGuard]
            }, {
                path: 'operatorlist',
                loadChildren: './settings/operator/list/operator.list.module#OperatorListModule',
                canActivate: [AuthGuard]
            }, {
                path: 'operator',
                loadChildren: './settings/operator/form/operator.form.module#OperatorFormModule',
                canActivate: [AuthGuard]
            }, {
                path: 'operator/:id',
                loadChildren: './settings/operator/form/operator.form.module#OperatorFormModule',
                canActivate: [AuthGuard]
            }, {
                path: 'profilelist',
                loadChildren: './settings/profile/list/profile.list.module#ProfileListModule',
                canActivate: [AuthGuard]
            }, {
                path: 'profile',
                loadChildren: './settings/profile/form/profile.form.module#ProfileFormModule',
                canActivate: [AuthGuard]
            }, {
                path: 'profile/:id',
                loadChildren: './settings/profile/form/profile.form.module#ProfileFormModule',
                canActivate: [AuthGuard]
            }, {
                path: 'careservicelist',
                loadChildren: './settings/careservice/list/careservice.list.module#CareserviceListModule',
                canActivate: [AuthGuard]
            }, {
                path: 'careservice',
                loadChildren: './settings/careservice/form/careservice.form.module#CareserviceFormModule',
                canActivate: [AuthGuard]
            }, {
                path: 'careservice/:id',
                loadChildren: './settings/careservice/form/careservice.form.module#CareserviceFormModule',
                canActivate: [AuthGuard]
            }, {
                path: 'careservice/:id/hours',
                loadChildren: './settings/careservice/hour/servicehour.module#ServicehourModule',
                canActivate: [AuthGuard]
            },
            {
                path: 'sign', component: SignComponent,
                canActivate: [AuthGuard]
            }
        ]
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [{
            path: 'pages',
            loadChildren: './pages/pages.module#PagesModule'
        }]
    }
];
