import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { PersonService } from '../../../services/person.service';
import { OperatorService } from '../../../services/operator.service';
import { CareserviceService } from '../../../services/careservice.service';
import { HealthCenterService } from '../../../services/health.center.service';
import { ProfileService } from '../../../services/profile.service';

declare const swal: any;

@Component({
    selector: 'operator-form-cmp',
    moduleId: module.id,
    templateUrl: 'operator.form.component.html'
})

export class OperatorFormComponent implements OnInit {

    @ViewChild('centerValue') autocomplete: ElementRef;
    healthCenter: any;
    title: string = "Nuevo Operador";
    operator: any = {};
    operatorId: number;
    operators: any[] = [];
    services: any = {};
    documentNumber: string;
    sex: string;
    person: any;
    centerCtrl: FormControl;
    healthCenters: any = {};
    profiles: any;
    filteredCenters: Observable<any[]>;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private healthCenterService: HealthCenterService,
        private operatorService: OperatorService,
        private careserviceService: CareserviceService,
        private cdr: ChangeDetectorRef,
        private profileService: ProfileService,
        private personService: PersonService) {
        this.route.params.subscribe(params => {
            this.operatorId = +params.id;
            // console.log(this.operatorId);
        });
        this.healthCenter = JSON.parse(localStorage.getItem('healthCenterHasOperator'));
        // Obtener Operador si es pasado el parametro
        if (this.operatorId && this.operatorId != 0) {
            this.title = "Modificar Operador";
            this.operatorService.getOperator(this.operatorId).subscribe((response: any) => {
                this.cdr.detectChanges();
                this.operator = response;
                this.operator.status = !response.status || response.status == null || response.status.toString() == 'BAJ' ? false : true;
                this.person = this.operator.person;
                this.operator.password = response.person.csn;
                this.operator.user = response.person.emailCipe;
                // console.log('operador -antes', this.operator);
                //Recorrer los healthcenter buscando si tiene datos de perfil
                if (this.operator.healthCenterHasOperator && this.operator.healthCenterHasOperator.length > 0) {
                    this.operator.healthCenterHasOperator.forEach((obj: any, index: any) => {
                        if (!obj.profile || obj.profile === null) {
                            // console.log("entra");
                            this.operator.healthCenterHasOperator[index].profile = { id: null };
                            this.operator.healthCenterHasOperator[index].status = 'ACT';
                        }
                    })
                }
                // console.log(this.operator);
            }, error => {
                // if (error.status === 500) {
                swal({
                    title: 'Se Produjo un Error',
                    animation: false,
                    customClass: 'animated tada',
                    confirmButtonColor: '#f44336'
                });
                // }
            });
        }
        else {
            let obj: any = {};
            obj.healthCenter = { id: null };
            obj.healthCenter.id = this.healthCenter.id;
            obj.profile = { id: null };
            obj.status = 'ACT';
            this.operator.healthCenterHasOperator = [];
            this.operator.healthCenterHasOperator[0] = obj;
        }
        //Obtener Perfiles
        this.profileService.getAllProfilesnoOperator().subscribe((response: any) => {
            this.cdr.detectChanges();
            this.profiles = Array.from(response);
            // console.log('perfiles', this.profiles);
        });
        //
        //Obtener Centros de Salud
        this.healthCenterService.getAllHealthCenters().subscribe((response: any) => {
            this.cdr.detectChanges();
            this.healthCenters = response.content;
            // console.log('centros', this.healthCenters);
            // Asignar los cambios del filtro
            this.filteredCenters = this.centerCtrl.valueChanges
                .startWith(null)
                .map(center => center ? this.filterCenter(center) : this.healthCenters.slice());
            //
        })
        //Definir control para el autocompletar
        this.centerCtrl = new FormControl();
        // this.cdr.detectChanges();
    }
    filterCenter(name: string) {
        return this.healthCenters.filter((center: any) =>
            center.name.toString().toUpperCase().indexOf(name.toString().toUpperCase()) >= 0);
    }

    ngOnInit() {
        document.querySelector('#top').scrollIntoView({ behavior: 'smooth' });
        this.cdr.detectChanges();
    }

    onSubmit() {
        this.operator.status = this.operator.status ? 'ACT' : 'BAJ';
        // this.operator.status = this.operator.status ? 'ACT' : 'BAJ';
        this.operator.person = {};
        this.operator.person.id = this.person.id;

        if (this.operatorId && this.operatorId !== null) {
            this.operatorService.putOperator(this.operatorId, this.operator).subscribe((response: any) => {
                this.router.navigateByUrl('operatorlist');
            }, error => {
                swal({
                    title: 'Error al modificar Operador',
                    animation: false,
                    customClass: 'animated tada',
                    confirmButtonColor: '#f44336'
                });
            });
        }
        else {
            this.operatorService.postOperator(this.operator).subscribe((response: any) => {
                // this.operator = response;
                this.router.navigateByUrl('operatorlist');
                // this.operatorId = response.id;
                // this.operator.id = this.operatorId;
            }, error => {
                let msg = JSON.parse(error._body).message;
                if (error.status === 400 || error.status === 409) {
                    swal({
                        title:  msg,
                        animation: false,
                        customClass: 'animated tada',
                        confirmButtonColor: '#f44336'
                    });
                }
                else {
                    swal({
                        title: 'Error al crear Operador',
                        animation: false,
                        customClass: 'animated tada',
                        confirmButtonColor: '#f44336'
                    });
                }
            });
        }

    }
    cancelSubmit() {
        this.router.navigateByUrl('operatorlist');
    }
    findPerson() {
        this.personService.getByDocumentAndSex(this.documentNumber, this.sex).subscribe(
            response => {
                this.person = response;
                this.operator.person = response;
                if (this.person) {
                    // console.log(this.person);
                    this.operator.email = this.person.email;
                    this.operator.password = this.person.csn;
                    // this.operator.user = this.person.emailCipe;
                    // console.log(this.operator);

                    // this.closeService(this.documentNumber);
                }
                else {
                    swal({
                        title: 'Verifique datos de la persona',
                        animation: false,
                        customClass: 'animated tada',
                        confirmButtonColor: '#f44336'
                    });
                }
            },
            error => {
                swal({
                    title: 'Verifique datos de la persona',
                    animation: false,
                    customClass: 'animated tada',
                    confirmButtonColor: '#f44336'
                });
            }
        );
    }
    addCenter(center: any) {
        let aux = false;
        let healthC: any = {};
        if (!this.operator.healthCenterHasOperator) {
            this.operator.healthCenterHasOperator = [];
        }
        if (center !== null && center !== "" && typeof center != "string" && this.operator.healthCenterHasOperator.length > 0) {
            // healthC.id = center.id;
            // healthC.healthCenter = center;
            // console.log("entra");
            this.operator.healthCenterHasOperator.map((obj: any) => {
                if (Object.is(center, obj.healthCenter) || center.id == obj.healthCenter.id) {
                    aux = true;
                    swal({
                        title: 'Ya se encuentra el Centro Asociado',
                        animation: false,
                        customClass: 'animated tada',
                        confirmButtonColor: '#f44336'
                    });
                }
            })
        }
        if (center !== null && center !== "" && typeof center != "string" && !aux) {
            // healthC.id = center.id;
            healthC.healthCenter = center;
            healthC.profile = { id: null };
            healthC.status = 'ACT';
            this.operator.healthCenterHasOperator.push(healthC);
        }
        this.autocomplete.nativeElement.value = null;
        // console.log(this.operator.healthCenterHasOperator);
    }
    displayFn(center: any) {
        // console.log(center);
        return center ? center.name : center;
    }
    closePerson() {
        this.operator = {};
        this.person = null;
        this.documentNumber = null;
        this.sex = null;
    }
    deleteRow(row: any) {
        let arr: any[] = [];
        this.operator.healthCenterHasOperator.forEach((r: any) => {
            if (!Object.is(row, r)) {
                arr.push(r)
            }
        });
        this.operator.healthCenterHasOperator = arr;
    }
}
