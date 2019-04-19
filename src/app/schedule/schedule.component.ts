import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';


import { PersonService } from '../services/person.service';
import { CareserviceService } from '../services/careservice.service';
import { HealthCenterService } from '../services/health.center.service';

import { ScheduleService } from '../services/schedule.service';
import { PlanningService } from '../services/planning.service';
//
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

declare const swal: any;
declare const $: any;

@Component({
    selector: 'app-schedule-cmp',
    templateUrl: 'schedule.component.html'
})

export class ScheduleComponent implements OnInit {
    showCalendar: boolean = false;
    patience: any;
    documentNumber: string;
    sex: string;
    model4: any;
    service: any;
    calendarAlreadyRendered: boolean = false;
    isOnDemand: boolean = false;
    schedules: any[];
    plannings: any[];
    //
    schedule: any = {};
    services: any[];
    serviceCtrl: FormControl;
    filteredServices: Observable<any[]>;
    aux: any;
    //
    healthCenters: any;
    isPlanning: boolean = true;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private personService: PersonService,
        private careserviceService: CareserviceService,
        private scheduleService: ScheduleService,
        private healthCenterService: HealthCenterService,
        private planningService: PlanningService
    ) {
        //Definir control para el autocompletar
        this.serviceCtrl = new FormControl();
        let patience: string = localStorage.getItem('currentPatience');
        this.isPlanning = JSON.parse(localStorage.getItem('healthCenterHasOperator')).healthCenter.isPlanning;
        if (patience) {
            this.patience = JSON.parse(patience);
            this.scheduleService.setPhoto(this.patience);
        }
        $('.main-content').scrollTop(0);
        this.careserviceService.getActiveCareservices(false).subscribe((response: any) => {
            this.services = response.content;
            this.aux = response.content;
            // console.log('services', this.services);
            // Asignar los cambios del filtro
            this.filteredServices = this.serviceCtrl.valueChanges
                // .debounceTime(100)
                .startWith(null)
                .map(service => {
                    if (service && typeof service !== 'object') {
                        this.careserviceService.getServicesByName(service, false).map(response => response).subscribe((response: any) => {
                            // console.log('responde', response);
                            // // console.log(this.filterService(service).then((response)=>{return response})); return service ? this.filterService(service).then((response)=>{return response}) : this.services.slice()
                            this.aux = response;

                        });
                        return this.aux.filter((ser: any) =>
                            ser.name.toString().toUpperCase().indexOf(service.toString().toUpperCase()) >= 0
                        );
                    }
                    else {
                        return this.services.slice();
                    }

                });
            //
        });
        this.healthCenterService.getAllHealthCenters().subscribe((response: any) => {
            this.healthCenters = response.content;
        });
    }

    ngOnInit() {
        document.querySelector('#top').scrollIntoView({ behavior: 'smooth' });
    }

    checkPatienceSelected() {
        if (!this.patience) {
            this.notFound('Seleccione un Paciente');
            return false;
        }
        else {
            return true;
        }
    }

    findPerson() {
        this.personService.getByDocumentAndSex(this.documentNumber, this.sex).subscribe(
            response => {
                this.patience = response;
                localStorage.setItem('currentPatience', JSON.stringify(this.patience));
                this.scheduleService.setPhoto(this.patience);
                if (!this.patience) {
                    this.notFound('Paciente No Encontrado');
                }
            },
            error => {
                this.notFound('Paciente No Encontrado');
            }
        );
    }

    private getSchedules() {
        this.scheduleService.getSchedules(this.service.id).subscribe((schedules: any) => {
            if (this.service.typeService == 'DEM') {
                this.schedules = this.scheduleService.filterTodaySchedules(schedules);
                this.planningService.getServicePlanning(this.service.id).subscribe((plannings: any) => {
                    this.plannings = this.scheduleService.filterTodayPlannings(plannings);
                    this.schedules.reverse();
                    this.isOnDemand = true;
                });
            }
            else {
                let list: any[] = schedules;
                if (list.length == 0) {
                    this.notFound('El servicio de ' + this.service.name + ' no tiene horarios programados');
                    this.service = null;
                }
                else {
                    this.scheduleService.initCalendar(this, schedules, this.service.duration, false);
                }
            }
        },
            error => {
                alert("Error al traer turnos");
            });
    }

    // findService() {
    //     if (!this.model4 || this.model4.length < 2)
    //         return;
    //     this.careserviceService.getServicesByName(this.model4).subscribe(response => {
    //         this.service = response[0];
    //         if (this.service) {
    //             this.getSchedules();
    //         }
    //         else {
    //             this.notFound('Servicio No Encontrado');
    //         }
    //     },
    //         error => {
    //             alert("Error al buscar servicio");
    //         });
    // }
    changeHealthCenter(healthCenter: any) {
        this.patience.healthCenter = healthCenter;
    }
    notFound(msg: string) {
        swal({
            title: msg,
            timer: 2000,
            confirmButtonColor: '#f44336'
        });
    }

    sendChanges() {
        var arr: any[] = [];
        this.schedules.forEach((el: any) => {
            arr.push(el);
        });
        this.scheduleService.sendChanges(this, arr);
    }

    discardChanges() {
        window.location.reload();
    }

    private existsInSchedules(patience: any) {
        // debugger
        let aux = false;
        for (let s of this.schedules) {
            if (s.person && patience.docNumber == s.person.docNumber && (s.status == 'ACT' || s.status == 'CON')) {
                console.log('true');
                aux = true;
            }
        }
        return aux;
    }

    assignPatience() {
        if (this.checkPatienceSelected() && !this.existsInSchedules(this.patience)) {
            if (!this.scheduleService.expiredPlanning(this.plannings)) {
                this.schedules.reverse();
                // console.log(this.schedules);
                this.isOnDemand = true;
                this.scheduleService.addOnDemand(this, this.schedules);
                this.schedules.reverse();
            }
            else {
                this.notFound("No hay horarios disponibles");
            }
        }
        else {
            this.notFound("El Paciente ya tiene turno asignado");
        }

    }

    removeOnDemand(schedule: any, index: number) {
        if (schedule.id) {
            schedule.status = 'CAN';
            schedule.touched = true;
        }
        else {
            this.schedules.splice(index, 1);
        }
    }
    onSubmit() {
        if (!this.patience.healthCenter) {
            this.dialog("Seleccione Centro de Salud");
            return;
        }
        $('#exampleModalLong').modal('hide');
        this.personService.savePerson(this.patience).subscribe((response: any) => {
            localStorage.setItem('currentPatience', JSON.stringify(this.patience));
            // this.location.back();
        });
    }
    dialog(msg: string) {
        swal({
            title: msg,
            timer: 2000,
            confirmButtonColor: '#f44336'
        });
    }

    editPatience() {
        //this.router.navigateByUrl('/patience');
        $('#exampleModalLong').modal();
    }

    closePatience() {
        this.patience = null;
        this.documentNumber = '';
        this.sex = '';
        localStorage.removeItem('currentPatience');
    }

    closeService() {
        window.location.reload();
    }

    displayFn(service: any) {
        // this.service = service;
        // console.log(service);
        return service ? service.name : service;
    }

    filterService(name: string) {
        // let aux = this.services;
        // console.log('servicios filtrados', this.services);
        let p1 = new Promise((resolve, reject) => {
            this.careserviceService.getServicesByName(name, false).map(response => response).subscribe((response: any) => {
                // console.log('responde', response);
                resolve(response.value);
            });
        });
        return p1;
        // return p1.then((response:any)=>{
        //     return response;
        // });

        // // console.log("return",name);
        // // setTimeout(()=>{
        // //     // return this.services;
        // //     // console.log("object");
        // this.services.filter((professional: any) =>
        //     professional.name.toString().toUpperCase().indexOf(name.toString().toUpperCase()) >= 0
        // );
        // return this.services;
        // },2000);
    }
    findService() {
        // // console.log("object", this.schedule.service);
        if (this.schedule.service && typeof this.schedule.service == 'object') {
            this.service = this.schedule.service;
            if (this.service.status != 'ACT') {
                this.notFound('Servicio No Habilitado');
                this.service = null;
            }
            else {
                this.getSchedules();
            }
        }
    }
}
