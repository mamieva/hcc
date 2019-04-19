import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/profile/startWith';
// import 'rxjs/add/profile/map';


import { PersonService } from '../../../services/person.service';
import { ProfileService } from '../../../services/profile.service';
import { ModuleService } from '../../../services/module.service';
import { CareserviceService } from '../../../services/careservice.service';
import { HealthCenterService } from '../../../services/health.center.service';

declare const swal: any;

@Component({
    selector: 'profile-form-cmp',
    moduleId: module.id,
    templateUrl: 'profile.form.component.html'
})

export class ProfileFormComponent implements OnInit {

    @ViewChild('centerValue') autocomplete: ElementRef;

    title: string = "Nuevo Perfil";
    profile: any = {};
    profileId: number;
    profiles: any[];
    Roles: any;
    modules: any = [];
    permission: any = [];

    constructor(private route: ActivatedRoute,
        private router: Router,
        private healthCenterService: HealthCenterService,
        private profileService: ProfileService,
        private moduleService: ModuleService,
        private careserviceService: CareserviceService,
        private cdref: ChangeDetectorRef,
        private personService: PersonService) {
        this.route.params.subscribe(params => {
            this.profileId = +params.id;
            // console.log(this.profileId);
        });
        this.profile.profileRoles = [];
        //Obtener Modulos
        this.moduleService.getAllModules().subscribe((response: any) => {
            this.modules = response;
            // console.log('modulos', this.modules);
            // Obtener Operador si es pasado el parametro
            if (this.profileId && this.profileId != 0) {
                this.title = "Modificar Perfil";
                this.profileService.getProfile(this.profileId).subscribe((response: any) => {
                    let profilesRoles: any = response.profileRoles;
                    this.transformRoles(profilesRoles, (p: any) => {
                        response.profileRoles = p;
                        this.profile = response;
                        // this.profile.profileRoles = [];
                        // console.log(this.profile);
                        this.profile.status = response.status.toString() == 'BAJ' ? false : true;
                        // console.log('pasado transform', this.profile);
                        this.cdref.detectChanges();
                    });
                });
            }
        })
    }
    ngOnInit() {
        document.querySelector('#top').scrollIntoView({ behavior: 'smooth' });
        this.cdref.detectChanges();
        //Obtener Modulos
        // this.moduleService.getAllModules().subscribe((response: any) => {
        //     this.modules = response;
        //     // console.log('modulos', this.modules);
        // })
    }
    onSubmit() {
        this.profile.status = this.profile.status ? 'ACT' : 'BAJ';
        // console.log('modificar', this.profile);
        // console.log('modificar', this.permission);

        let profileRoles: any = [];

        this.profile.profileRoles.forEach((rol: any) => {
            rol.forEach((p: any) => {
                if (p && p !== null) {
                    let obj = { rol: { name: '', status: '' } };
                    obj.rol.name = p;
                    obj.rol.status = 'ACT';
                    profileRoles.push(obj);

                }
            })
        })

        this.profile.profileRoles = profileRoles;
        // console.log('submit', this.profile.profileRoles);

        if (this.profileId && this.profileId != 0) {
            this.profileService.putProfile(this.profileId, this.profile).subscribe((response: any) => {
                this.router.navigateByUrl('profilelist');

                // let profilesRoles: any = response.profileRoles;
                // this.transformRoles(profilesRoles, (p: any) => {
                //     response.profileRoles = p;
                //     this.profile = response;
                // });
                // this.cdref.detectChanges();
                // // this.transformRoles(profileRoles, );
                // // console.log('pasado transform', this.profile);
                // this.profileId = response;
            }, error => {
                swal({
                    title: 'Error al modificar Perfil',
                    animation: false,
                    customClass: 'animated tada',
                    confirmButtonColor: '#f44336'
                });
            });
        }
        else {
            this.profileService.postProfile(this.profile).subscribe((response: any) => {
                // let profilesRoles: any = response.profileRoles;
                // this.transformRoles(profilesRoles, (p: any) => {
                //     response.profileRoles = p;
                //     this.profile = response;
                //     this.profileId = this.profile.id;
                // });
                this.router.navigateByUrl('profilelist');

                // this.cdref.detectChanges();
                // this.profile = response;
            }, error => {
                swal({
                    title: 'Error al crear Perfil',
                    animation: false,
                    customClass: 'animated tada',
                    confirmButtonColor: '#f44336'
                });
            });
            // console.log('nuevo', this.profile);
        }
    }
    transformRoles(profileRoles: any, callback: any) {
        let roles: any = [];
        this.modules = this.modules.sort((a: any, b: any) => { return a.id - b.id })
        // console.log(this.modules);
        this.modules.forEach((mod: any) => {
            let modulo: any;
            modulo = mod.code; //.substr(0,rol.name.indexOf('_'));
            // console.log('modulo', modulo);
            roles[modulo] = [];
        });
        profileRoles.forEach((rol: any) => {
            let md: any;
            if (rol.rol && rol.rol !== null) {
                md = rol.rol.name.substr(0, rol.rol.name.indexOf('_'));
                if (roles[md] && roles[md].indexOf(rol.rol.name) < 0)
                    roles[md].push(rol.rol.name);
            }
        })
        profileRoles = [];
        // console.log(roles);
        this.modules.forEach((r: any) => {
            // console.log('r', r);
            profileRoles.push(roles[r.code]);
        })

        callback(profileRoles);
        // return profileRoles;
        // // console.log('final', this.profile);
    }
    cancelSubmit() {
        this.router.navigateByUrl('profilelist');
    }
}
