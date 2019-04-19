import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { SpecialityService } from '../../../services/speciality.service';

import { CareserviceService } from '../../../services/careservice.service';

declare const swal: any;

@Component({
    selector: 'careservice-form-cmp',
    moduleId: module.id,
    templateUrl: 'careservice.form.component.html'
})

export class CareserviceFormComponent implements OnInit {
    title: string = "Nuevo Servicio de Atención";
    model: any = {
        typeService: "PRO",
        serviceHasSpecialties: []
    };
    id: number;
    typeServiceName: string = 'Programado';
    //
    specialty: any;
    specialities: any[] = [];
    auxSpecialty: any[] = [];
    specialtyCtrl: FormControl;
    filteredSpecialty: Observable<any[]>;
    //

    constructor(private route: ActivatedRoute,
        private router: Router,
        private careserviceService: CareserviceService,
        private specialityService: SpecialityService) {
        this.route.params.subscribe(params => {
            this.id = +params.id;
        });
        this.specialtyCtrl = new FormControl();

        if (this.id) {
            this.title = "Modificar Servicio de Atención";
            careserviceService.getService(this.id).subscribe(response => {
                this.model = response;
                let typeService: string = this.model.typeService;
                if (typeService == 'PRO') {
                    this.typeServiceName = 'Programado';
                }
                else if (typeService == 'DEM') {
                    this.typeServiceName = 'Demanda';
                }
                else {
                    this.typeServiceName = 'Inter-consulta';
                }
                this.model.enabled = this.model.status == 'ACT';
                this.specialty = this.model.serviceHasSpecialties[0] ? this.model.serviceHasSpecialties[0].specialty : null;
                // console.log(this.specialty);
                // console.log(this.model);
            });

        }
        this.specialityService.getAllSpecialties('').subscribe((response: any) => {
            this.specialities = response.content;
            this.auxSpecialty = response.content;
            //
            this.filteredSpecialty = this.specialtyCtrl.valueChanges
                .startWith(null)
                .map((search: any) => {
                    if (search && typeof search !== 'object') {
                        this.specialityService.getAllSpecialties(search).map(response => response).subscribe((response: any) => {
                            // console.log('responde', response);
                            // // console.log(this.filterService(service).then((response)=>{return response})); return service ? this.filterService(service).then((response)=>{return response}) : this.services.slice()
                            this.auxSpecialty = response.content;
                        });
                        return this.auxSpecialty.filter((vad: any) =>
                            vad.name.toString().toUpperCase().indexOf(search.toString().toUpperCase()) >= 0
                        );
                    }
                    else {
                        return this.specialities.slice();
                    }
                });
        });

    }

    ngOnInit() {
        document.querySelector('#top').scrollIntoView({ behavior: 'smooth' });
    }

    changeTypeService(typeService: string) {
        this.model.typeService = typeService;
        if (typeService == 'PRO') {
            this.typeServiceName = 'Programado';
        }
        else if (typeService == 'DEM') {
            this.typeServiceName = 'Demanda';
        }
        else {
            this.typeServiceName = 'Inter-consulta';
        }
    }

    onSubmit() {
        if (this.model.duration >= 10) {
            let healthCenterHasOperator: any = JSON.parse(localStorage.getItem('healthCenterHasOperator'));
            this.model.status = this.model.enabled ? 'ACT' : 'INA';
            this.model.healthCenter = { id: healthCenterHasOperator.healthCenter.id };
            if (this.specialty)
                this.model.serviceHasSpecialties = [];
            this.model.serviceHasSpecialties.push({ specialty: { id: this.specialty.id } });
            // console.log(this.model);
            if (this.id) {
                this.careserviceService.putService(this.id, this.model).subscribe(response => {
                    this.router.navigateByUrl('careservicelist');
                },
                    error => {
                        this.dialog(JSON.parse(error._body).message);
                    });
            }
            else {
                this.careserviceService.postService(this.model).subscribe(response => {
                    this.router.navigateByUrl('careservicelist');
                },
                    error => {
                        this.dialog(JSON.parse(error._body).message);
                    });
            }

        }
        else {
            this.dialog("La duración debe ser mayor a 10min");
        }
    }
    cancelSubmit() {
        this.router.navigateByUrl('careservicelist');
    }

    deleteService() {
        this.careserviceService.deleteService(this.id).subscribe((response: any) => {
            this.dialog('Eliminado con Éxito');
            this.router.navigateByUrl('/careservicelist')
        },
            error => {
                this.dialog(JSON.parse(error._body).message);
            })
    }

    dialog(msg: string) {
        swal({
            title: msg,
            animation: false,
            customClass: 'animated tada',
            confirmButtonColor: '#f44336'
        });
    }
    displayFn(diag: any) {
        // console.log(diag);
        return diag ? diag.name : diag; //+ ' - ' + pres.potency.replace(/\t/g, '') + ' x' + pres.content.replace(/\t/g, '') + ' - ' + pres.pharmaceuticalForm.replace(/\t/g, '') : pres;
    }
}
