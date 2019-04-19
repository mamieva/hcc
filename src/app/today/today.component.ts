import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PersonService } from '../services/person.service';
import { TodayService } from '../services/today.service';
import { ScheduleService } from '../services/schedule.service';
import { CareserviceService } from '../services/careservice.service';
import { SpecialityService } from '../services/speciality.service';
import { PlanningService } from '../services/planning.service';
import { OperatorService } from '../services/operator.service';
//
import { AppSettings } from '../app.settings';

import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { CloseScrollStrategy } from '@angular/cdk/overlay/typings/scroll/close-scroll-strategy';
import { timeout } from 'rxjs/operator/timeout';

declare const moment: any;
declare const swal: any;
declare const $: any;

@Component({
    selector: 'today-cmp',
    moduleId: module.id,
    templateUrl: 'today.component.html'
})

export class TodayComponent implements OnInit {
    docNumberSex: any;
    searchResult: any = {};
    searchResultFiltered: any = {};
    currentPage: number = 0;
    pageSize: number = 10;
    showSearchInput = false;
    title: string = "Hoy";
    model: any = {};
    patience: any;
    documentNumber: string;
    sex: string;
    model4: any;
    googleGeoCode: string = "https://maps.googleapis.com/maps/api/geocode/json?address=:keyword";
    service: any;
    //
    today: any = {};
    services: any[];
    serviceCtrl: FormControl;
    filteredServices: Observable<any[]>;
    aux: any;
    healthCenterHasOperator: any;
    //
    page: any = 0;
    totalPages: any;
    size: any = 20;
    search: any = '';
    //
    timer: any;
    setInterval: any = true;
    timerSeconds: number;
    //
    currentUser: any;
    //
    modelInterconsultation: any = { remoteService: null };
    //
    specialties: any[] = [];
    interconsultationsList: any[] = [];
    //
    reproSchedule: any = { id: "" };
    futureSchedules: any;
    //
    interconsultShow: any;
    //
    operator: any = {};
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private todayService: TodayService,
        private personService: PersonService,
        private careserviceService: CareserviceService,
        private scheduleService: ScheduleService,
        private specialtyService: SpecialityService,
        private planningService: PlanningService,
        private operatorService: OperatorService
    ) {
        if (this.setInterval) {
            this.timerSeconds = 30;
            setInterval(() => {
                if (this.timerSeconds == 0)
                    this.timerSeconds = 30;
                this.timerSeconds -= 1;
            }, 1000);
        }
        this.currentUser = localStorage.getItem('currentUser');
        this.healthCenterHasOperator = JSON.parse(localStorage.getItem('healthCenterHasOperator'));
        //Definir control para el autocompletar
        this.serviceCtrl = new FormControl();
        this.careserviceService.getActiveCareservices(true).subscribe((response: any) => {
            this.services = response.content;
            this.aux = response.content;
            // console.log('services', this.services);
            // Asignar los cambios del filtro
            this.filteredServices = this.serviceCtrl.valueChanges
                // .debounceTime(100)
                .startWith(null)
                .map(service => {
                    if (service && typeof service !== 'object') {
                        this.careserviceService.getServicesByName(service, true).map(response => response).subscribe((response: any) => {
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
        });

        specialtyService.getSpecialities().subscribe((response: any) => {
            this.specialties = response;
        });

        let operatorId = JSON.parse(localStorage.getItem('currentUser')).authToken.claims.scopes.id;

        this.operatorService.getOperator(operatorId).subscribe((response: any) => {
            // debugger;
            this.operator = response;
            let roles: any[] = response.healthCenterHasOperator[0].profile.profileRoles;
            // // console.log(roles);
            if (this.contains(roles, 'INTERCONSULTATION_CREATE') && this.contains(roles, 'INTERCONSULTATION_DELETE'))
                this.interconsultShow = true;
        });
    }


    ngOnInit() {
        document.querySelector('#top').scrollIntoView({ behavior: 'smooth' });
        this.intervalToday('');
    }
    ngOnDestroy() {
        clearInterval(this.timer);
    }

    intervalToday(search: any) {
        this.findTodaySchedules(search);
        if (this.setInterval) {
            this.timer = setInterval(() => {
                // console.log(search);
                this.findTodaySchedules(search + '&page=' + this.page + '&size=' + this.size);
            }, 30000);
        }
    }

    findTodaySchedules(search: string) {
        this.todayService.getToday(search).subscribe(response => {
            this.searchResult = response;
            let i;
            this.searchResultFiltered.content = [];
            for (i = 0; i < this.searchResult.content.length; i++)
                this.searchResultFiltered.content.push(this.searchResult.content[i]);
        });
    }

    findPerson() {
        this.personService.getByDocumentAndSex(this.documentNumber, this.sex).subscribe(
            response => {
                this.patience = response;
                if (this.patience) {
                    clearInterval(this.timer);
                    this.closeService(this.documentNumber);
                }
                else {
                    swal({
                        title: 'Paciente No Encontrado',
                        animation: false,
                        customClass: 'animated tada',
                        confirmButtonColor: '#f44336'
                    });
                }
            },
            error => {
                swal({
                    title: 'Paciente No Encontrado',
                    animation: false,
                    customClass: 'animated tada',
                    confirmButtonColor: '#f44336'
                });
            }
        );
    }

    // findService() {
    //     if (!this.model4 || this.model4.length < 2)
    //         return;
    //     this.careserviceService.getServicesByName(this.model4).subscribe(response => {
    //         this.service = response[0];
    //         if (this.service) {
    //             this.closePatience(this.service.name);
    //         }
    //         else
    //             swal({
    //                 title: 'Servicio No Encontrado',                   
    //                 animation: false,
    //                 customClass: 'animated tada',
    //                 confirmButtonColor: '#f44336'
    //               });
    //     },
    //     error => {
    //         alert("Error al buscar servicio");
    //     });
    // }

    closePatience(search: string) {
        this.search = search;
        clearInterval(this.timer)
        this.patience = null;
        this.documentNumber = '';
        this.sex = '';
        this.intervalToday(search);
    }

    closeService(search: string) {
        this.search = search;
        clearInterval(this.timer)
        this.service = null;
        this.model4 = '';
        this.intervalToday(search);
    }

    getPagingInfo() {
        if (this.searchResult.page.totalElements == 0) {
            return "";
        }
        this.totalPages = this.searchResult.page.totalPages;
        let from: number = this.searchResult.page.number * this.searchResult.page.size + 1;
        let to: number = (this.searchResult.page.number + 1) * this.searchResult.page.size;
        if (to > this.searchResult.page.totalElements) {
            to = this.searchResult.page.totalElements;
        }
        return from + "-" + to + " de " + this.searchResult.page.totalElements;
    }

    filterList(ev: any) {
        let list: any[];
        let i;
        this.searchResultFiltered.content = [];
        for (i = 0; i < this.searchResult.content.length; i++)
            this.searchResultFiltered.content.push(this.searchResult.content[i])
        list = this.searchResultFiltered.content;
        this.searchResultFiltered.content = list.filter(it =>
            (it['name'] && it['name'].toUpperCase().includes(this.model.search.toUpperCase()))
            || (it['address'] && it['address'].toUpperCase().includes(this.model.search.toUpperCase()))
            || (it['city'] && it['city'].toUpperCase().includes(this.model.search.toUpperCase()))
        );
    }

    zeroPad(num: number, places: number) {
        let zero: number = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }

    getScheduleTime(row: any) {
        let start: Date = moment(row.scheduledDateFrom, 'DD-MM-YYYY HH:mm:ss').toDate();
        let end: Date = moment(row.scheduledDateTo, 'DD-MM-YYYY HH:mm:ss').toDate();
        let left: string = this.zeroPad(start.getHours(), 2) + ':' + this.zeroPad(start.getMinutes(), 2);
        let right: string = this.zeroPad(end.getHours(), 2) + ':' + this.zeroPad(end.getMinutes(), 2);
        if (left == '00:00' && right == '00:00') {
            return '----';
        }
        return left + ' - ' + right;
    }

    getStatus(row: any) {
        if (row.status == 'CON') {
            return "En Consulta";
        }
        if (row.status == 'CAN') {
            return "Cancelado";
        }
        if (row.status == 'FIN') {
            return "Finalizado";
        }
        if (!row.arrivalTime) {
            return "Pendiente";
        }
        return "En Espera";
    }

    // isPublic(row: any) {
    //     if (row.healthcenter.isPublic == "1")
    //         return true;
    //     else
    //         return false;
    // }

    moveToWaitingStatus(row: any, index: any) {
        if (row.telemedicine) {
            this.todayService.putArrivalInterconsultation(row.id).subscribe((response: any) => {
                // row.arrivalTime = new Date();
                row = response;
                this.searchResultFiltered.content[index] = response;

            },
                error => {
                    if (error.status == 401) {
                        this.dialog("Usted No Posee Permisos para la Acción Requerida");
                    }
                    if (error.status == 409) {
                        this.dialog(JSON.parse(error._body).message);
                    }
                    else {
                        this.dialog('Verifique sus Permisos');
                    }
                    // alert('Error al pasar el paciente a espera');
                });
        }
        else {
            this.todayService.putArrival(row.id).subscribe(response => {
                // row.arrivalTime = new Date();
                row = response;
                this.searchResultFiltered.content[index] = response;
            },
                error => {
                    if (error.status == 401) {
                        this.dialog("Usted No Posee Permisos para la Acción Requerida");
                    }
                    if (error.status == 409) {
                        this.dialog(JSON.parse(error._body).message);
                    }
                    else {
                        this.dialog('Verifique sus Permisos');
                    }
                    // alert('Error al pasar el paciente a espera');
                });
        }

    }
    moveToConsultation(row: any) {
        this.router.navigateByUrl('/today/' + row.id + '/consultation');
    }

    cancelSchedule(row: any) {
        let status: string = row.status;
        row.status = 'CAN';

        if (row.telemedicine) {
            this.scheduleService.cancelScheduleTelemedicine(row).subscribe(response => {
                location.reload();
            },
                error => {
                    row.status = status;
                    // alert('Error al cancelar el turno');
                    if (error.status == 401) {
                        this.dialog("Usted No Posee Permisos para la Acción Requerida");
                    }
                    if (error.status == 409) {
                        this.dialog(JSON.parse(error._body).message);
                    }
                    else {
                        this.dialog('Verifique sus Permisos');
                    }
                });
        }
        else {
            this.scheduleService.cancelSchedule(row).subscribe(response => {
                location.reload();
            },
                error => {
                    row.status = status;
                    // alert('Error al cancelar el turno');
                    if (error.status == 401) {
                        this.dialog("Usted No Posee Permisos para la Acción Requerida");
                    }
                    if (error.status == 409) {
                        this.dialog(JSON.parse(error._body).message);
                    }
                    else {
                        this.dialog('Verifique sus Permisos');
                    }
                });
        }
    }

    newCenter() {
        this.router.navigateByUrl('/healthcenter/');
    }

    openRow(centerId: number) {
        this.router.navigateByUrl('/healthcenter/' + centerId);
    }
    findService() {
        if (this.today.service && typeof this.today.service == 'object') {
            this.service = this.today.service;
            clearInterval(this.timer);
            this.closePatience(this.service.name)
        }
    }
    displayFn(service: any) {
        return service ? service.name : service;
    }
    dialog(msg: string) {
        swal({
            title: msg,
            animation: false,
            customClass: 'animated tada',
            confirmButtonColor: '#f44336'
        });
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
    moveToPage(move: any) {
        // console.log('move', move);
        // console.log('page', this.page);
        // console.log('tpage', this.totalPages);
        if (this.page + move >= 0 && this.page + move <= this.totalPages - 1) {
            this.page = this.page + move;
            //+ '&page=' + page + '&size=' + size 
            this.todayService.getToday(this.search + '&page=' + this.page + '&size=' + this.size).subscribe((response: any) => {
                this.searchResult = response;
                this.searchResultFiltered.content = this.searchResult.content.map((i: any) => { return i; });
            });

        }
    }
    generateOrder(row: any) {
        this.scheduleService.postOrder(row.id, row).subscribe((response: any) => {
            // console.log(response);
            let schedule: any = {};
            schedule.scheduleId = row.id
            schedule.document = [];
            schedule.document.push(response.order);
            this.signAndSend(schedule, JSON.parse(this.currentUser));
        }, (error) => {
            // console.log(JSON.parse(error._body));
            let message = JSON.parse(error._body).message;
            this.dialog(message);
        });
    }
    signAndSend(body: any, currentUser: any) {
        // console.log('current', currentUser);

        // // console.log() body.document);
        // // console.log("signAndSend");    
        // // console.log(this.filesToPost);
        let file: any[] = [];
        body.document.forEach((element: any) => {
            if (!element.code && element.code != 'ADJ') {
                file.push(element);
            }
        });
        body.document = [];
        let fulljson = {
            //url: AppSettings.API_ENDPOINT + '/secure/files/upload',
            url: AppSettings.API_ENDPOINT,
            xAuthentication: 'Bearer ' + currentUser.authToken.token,
            procedure: body,
            files: file
        };
        // this.fulljson.files.push(file[0]);
        // console.log(fulljson);
        var fulljsonstring = JSON.stringify(fulljson);
        localStorage.setItem('consulta', fulljsonstring);
        // this.router.navigate(['today']);
        this.router.navigate(['/sign']);

    }
    demandInterconsultation(row: any) {
        this.careserviceService.getAllInterConsultCareservices().subscribe((response: any) => {
            this.interconsultationsList = response.content;
        });
        // console.log(row);
        this.modelInterconsultation.person = row.person;
        this.modelInterconsultation.service = row.service;
        this.modelInterconsultation.remoteService = { id: null };
        this.modelInterconsultation.priority = 2;
        this.modelInterconsultation.professional = row.professional;
        this.modelInterconsultation.status = 'ACT';
    }
    addDemandInterconsultation() {
        // console.log(this.modelInterconsultation);
        this.personService.postInterconsultationPatience(this.modelInterconsultation).subscribe((response: any) => {
            // console.log(response);
            this.dialog("Solicitud Generada con Éxito")
        }, (error: any) => {
            let msg = JSON.parse(error._body).message;
            this.dialog(msg);
            // this.dialog("Se Produjo un Error");
        });
    }
    changeServiceInterconsult(ev: any) {
        console.log(ev);
        if (ev)
            this.modelInterconsultation.telemedicine = ev.telemedicine;
    }
    openReproSchedule(row: any) {
        this.reproSchedule = { id: null };
        // console.log(row);
        this.reproSchedule = Object.assign({}, row);
        this.reproSchedule.id = null;
        this.reproSchedule.professional = null;
        this.planningService.getServiceFreeSchedules(row.service.id).subscribe((response: any) => {
            this.futureSchedules = response;
            if (this.futureSchedules.length == 0) {
                this.dialog("No se puede realizar la reprogramacion del turno, debido a que no existe planificación para el servicio seleccionado");
            }
        });
    }
    addReproSchedule() {
        // this.reproSchedule.scheduledDateFrom = null;
        // this.reproSchedule.scheduledDateTo = null;
        if (this.reproSchedule.id != null) {
            this.reproSchedule.status = 'ACT';
            this.scheduleService.saveSchedule(this.reproSchedule).subscribe((response: any) => {
                // console.log(response);
                this.dialog("Reprogramación Exitosa!")
            }, (error: any) => {
                this.dialog("Se produjo un Error insesperado");
            });
            // console.log(this.reproSchedule);
            this.reproSchedule = { id: null };
            $("#modalReprogramation").modal("hide");
        }
        else {
            this.dialog("No se puede realizar la reprogramacion del turno, debido a que no existe planificación para el servicio seleccionado");
        }
    }
}
