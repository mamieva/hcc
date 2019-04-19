import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { OperatorService } from '../services/operator.service';

declare const $: any;

//Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    // icon: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

//Menu Items
export const ROUTES: RouteInfo[] = [{
    path: '/schedule',
    title: 'Agenda',
    type: 'link',
    icontype: 'date_range'
}, {
    path: '/today',
    title: 'Hoy',
    type: 'link',
    icontype: 'today'
}, {
    path: '/interconsult',
    title: 'Inter-Consultas',
    type: 'link',
    icontype: 'date_range'
}, {
    path: '/patiencelist',
    title: 'Pacientes',
    type: 'link',
    icontype: 'portrait'
}, {
    path: '/',
    title: 'Profesionales',
    type: 'sub',
    icontype: 'portrait',
    children: [
        { path: 'consultationlist', title: 'Consulta Médica', ab: 'CM' },
        { path: 'medicalplanning', title: 'Mi Agenda', ab: 'MA' }
    ]
}, {
    path: '/',
    title: 'Reportes',
    type: 'sub',
    icontype: 'receipt',
    children: [
        { path: 'receipt', title: 'Planilla Diaria', ab: 'PD' },
        { path: 'receiptC2', title: 'Planilla Diaria Mensual', ab: 'PM' },
        { path: 'receiptSchedule', title: 'Turnos por Servicio', ab: 'PT' },
        { path: 'receiptPatience', title: 'Turnos por Paciente', ab: 'PP' }]
}, {
    path: '/',
    title: 'Configuración',
    type: 'sub',
    icontype: 'settings',
    children: [
        { path: 'healthcenterlist', title: 'Centros de Salud', ab: 'Ce' },
        // { path: 'specialitylist', title: 'Especialidades', ab: 'Es' },
        { path: 'professionallist', title: 'Profesionales', ab: 'Pr' },
        { path: 'operatorlist', title: 'Operadores', ab: 'Op' },
        { path: 'profilelist', title: 'Perfiles', ab: 'Pe' },
        //{path: 'icons', title: 'Farmacias', ab:'F'},
        { path: 'careservicelist', title: 'Planificación de Servicios', ab: 'Ps' }
    ]
}
];

@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html'
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    user: any;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private operatorService: OperatorService) {
        // // console.log("construcor");
        this.user = JSON.parse(localStorage.getItem('currentUser')).person;
        // // console.log("USER______",this.user);
    }

    isNotMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    ngOnInit() {
        let isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
        if (isWindows) {
            // if we are on windows OS we activate the perfectScrollbar function
            const $sidebar = $('.sidebar-wrapper');
            $sidebar.perfectScrollbar();
            // if we are on windows OS we activate the perfectScrollbar function
            $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();
            $('html').addClass('perfect-scrollbar-on');
        } else {
            $('html').addClass('perfect-scrollbar-off');
        }
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let healthCenter = JSON.parse(localStorage.getItem('healthCenterHasOperator')).healthCenter;
        this.operatorService.getOperator(this.user.operatorId).subscribe((response: any) => {
            // debugger;
            let roles: any[] = response.healthCenterHasOperator[0].profile.profileRoles;
            this.menuItems = ROUTES.filter(menuItem => {
                if (menuItem.path != '/') {
                    if (!this.contains(roles, 'SCHEDULE_SHOW') || !healthCenter.isPlanning) {
                        if (this.router.url == '/schedule')
                            this.router.navigateByUrl('today')
                    }
                    return (menuItem.title == 'Pacientes' && this.contains(roles, 'PERSON_SHOW'))
                        || (menuItem.title == 'Profesionales' && this.contains(roles, 'PROFESSIONAL_SHOW'))
                        || (menuItem.title == 'Planificación de Servicios' && this.contains(roles, 'PLANNING_SHOW'))
                        || (menuItem.title == 'Inter-Consultas' && this.contains(roles, 'INTERCONSULTATION_SHOW'))
                        || (menuItem.title == 'Agenda' && this.contains(roles, 'SCHEDULE_SHOW') && healthCenter.isPlanning)
                        || (menuItem.title == 'Planificación de Servicios' && this.contains(roles, 'SERVICES_SHOW'))
                        || (menuItem.title == 'Centros de Salud' && this.contains(roles, 'HEALTHCENTER_SHOW'))
                        || (menuItem.title == 'Hoy' && this.contains(roles, 'TODAY_SHOW'))
                        || (menuItem.title == 'Perfiles' && this.contains(roles, 'PROFILE_SHOW'))
                        || (menuItem.title == 'Operadores' && this.contains(roles, 'OPERATOR_SHOW'))
                        || (menuItem.title == 'Reportes' && this.contains(roles, 'REPORTING_SHOW'))
                        || menuItem.children
                }
                else {
                    let isTrue: any[] = [];
                    let ret: boolean = false;
                    menuItem.children.forEach((child: any, index: any) => {
                        if (child.title == 'Operadores' && this.contains(roles, 'OPERATOR_SHOW')
                            || (child.title == 'Perfiles' && this.contains(roles, 'PROFILE_SHOW'))
                            || (child.title == 'Profesionales' && this.contains(roles, 'PROFESSIONAL_SHOW'))
                            || (child.title == 'Mi Agenda' && this.contains(roles, 'PLANNING_SHOW'))
                            || (child.title == 'Planificación de Servicios' && this.contains(roles, 'SERVICES_SHOW'))
                            || (child.title == 'Planilla Diaria' && this.contains(roles, 'REPORTING_COOR_SHOW'))
                            || (child.title == 'Planilla Diaria Mensual' && this.contains(roles, 'REPORTING_COOR_SHOW'))
                            || (child.title == 'Turnos por Servicio' && this.contains(roles, 'REPORTING_ADMIN_SHOW'))
                            || (child.title == 'Turnos por Paciente' && this.contains(roles, 'REPORTING_ADMIN_SHOW'))
                            || (child.title == 'Centros de Salud' && this.contains(roles, "HEALTHCENTER_SHOW"))) {
                            ret = true;
                            isTrue.push(child);
                        }
                        else if (!ret) {
                            ret = false;
                        }
                    });
                    menuItem.children = isTrue;

                    return ret;
                }
            }
            );
        });
        //this.menuItems = ROUTES.filter(menuItem => menuItem);
    }

    contains(roles: any[], name: string) {
        // roles.forEach
        for (let r of roles) {
            if (r.rol !== null) {
                if (r.rol.name == name)
                    return true;
            }
        }
        return false;
    }

    logout() {
        this.authenticationService.logout();
    }
}
