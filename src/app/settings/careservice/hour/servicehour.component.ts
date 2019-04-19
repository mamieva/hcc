import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { DateAdapter, NativeDateAdapter } from '@angular/material';

import { MdSnackBar } from '@angular/material';

import { PlanningService } from '../../../services/planning.service';
import { ProfessionalService } from '../../../services/professional.service';
import { CareserviceService } from '../../../services/careservice.service';

declare const require: any;
declare const $: any;
declare const moment: any;
declare const swal: any;

@Component({
    selector: 'servicehour-cmp',
    moduleId: module.id,
    templateUrl: 'servicehour.component.html'
})

export class ServicehourComponent implements OnInit {
    model: any = {};
    serviceId: number;
    service: any = {};
    professional: any;
    hours: any[] = []; /*= [
        { dateFrom: moment('24-10-2017 06:30:00', 'DD-MM-YYYY HH:mm:ss').toDate(), dateTo: moment('24-10-2017 08:30:00', 'DD-MM-YYYY HH:mm:ss').toDate()},
        { dateFrom: moment('24-10-2017 10:00:00', 'DD-MM-YYYY HH:mm:ss').toDate(), dateTo: moment('24-10-2017 12:00:00', 'DD-MM-YYYY HH:mm:ss').toDate()}
    ]*/;
    hoursToDelete: any[] = [];
    focus: string;
    search: any = '';
    page: any = '';
    size: any = '';
    totalPages: number;
    professionalCtrl: FormControl;
    // professional: any = {};
    professionals: any;
    auxProfessionals: any;
    filteredProfessional: Observable<any[]>;
    addOrDelete: any = 'add';

    constructor(private route: ActivatedRoute,
        private router: Router,
        private planningService: PlanningService,
        private professionalService: ProfessionalService,
        private careserviceService: CareserviceService,
        private dateAdapter: DateAdapter<NativeDateAdapter>,
        public snackBar: MdSnackBar) {
        this.route.params.subscribe(params => {
            this.serviceId = +params.id;
            this.careserviceService.getService(this.serviceId).subscribe((service: any) => {
                this.service = service;
            },
                error => {
                    if (error.status == 409) {
                        this.dialog(JSON.parse(error._body).result);
                    }
                });
        });
        this.model.date = new Date();
        dateAdapter.setLocale('es-AR');
        planningService.getServicePlanning(this.serviceId).subscribe((plannings: any) => {
            this.hours = plannings;
            this.hours = this.hours.sort((a, b) => this.parseDate(a.dateFrom) - this.parseDate(b.dateFrom));
        });
        this.professionalCtrl = new FormControl();
        this.professionalService.getAllProfessionalsAct('').subscribe((response: any) => {
            // console.log(response);
            this.professionals = response.content;
            this.auxProfessionals = response.content;
            //
            this.filteredProfessional = this.professionalCtrl.valueChanges
                .startWith(null)
                .map((vademecum: any) => {
                    if (vademecum && typeof vademecum !== 'object') {
                        this.professionalService.getAllProfessionalsAct(vademecum).map(response => response).subscribe((response: any) => {
                            // console.log('responde', response);
                            // // console.log(this.filterService(service).then((response)=>{return response})); return service ? this.filterService(service).then((response)=>{return response}) : this.services.slice()
                            this.auxProfessionals = response.content;
                        });
                        return this.auxProfessionals.filter((vad: any) => {
                            return vad.person.lastName.toString().toUpperCase().indexOf(vademecum.toString().toUpperCase()) >= 0 ||
                                vad.person.lastName.toString().toUpperCase().indexOf(vademecum.toString().toUpperCase()) >= 0;

                        }

                        );
                    }
                    else {
                        return this.professionals.slice();
                    }
                });
        });
    }

    ngOnInit() {
        document.querySelector('#top').scrollIntoView({ behavior: 'smooth' });
    }

    dialog(msg: string) {
        swal({
            title: msg,
            animation: false,
            customClass: 'animated tada',
            confirmButtonColor: '#f44336'
        });
    }

    findProfessional() {
        this.professionalService.getProfessionals(this.model.search, this.page, this.size).subscribe((response: any) => {
            if (response.content) {
                this.professional = response.content[0];
            }
            if (!this.professional) {
                this.dialog('Profesional No Encontrado');
            }
        },
            error => {
                this.dialog('Profesional No Encontrado');
            });
    }

    private zeroPad(num: number, places: number) {
        let zero: number = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }

    parseDate(str: string) {
        return moment(str, 'DD-MM-YYYY HH:mm:ss').toDate();
    }

    formatDate(str: string) {
        let d: Date = this.parseDate(str);
        return this.zeroPad(d.getDate(), 2) + '-' + this.zeroPad(d.getMonth() + 1, 2) + '-' + d.getFullYear();
    }

    formatFullDate(d: Date) {
        return this.zeroPad(d.getDate(), 2) + '-' + this.zeroPad(d.getMonth() + 1, 2) + '-' + d.getFullYear() + ' ' + this.zeroPad(d.getHours(), 2) + ':' + this.zeroPad(d.getMinutes(), 2) + ':00';
    }

    formatHour(str: string) {
        let d: Date = this.parseDate(str);
        return this.zeroPad(d.getHours(), 2) + ':' + this.zeroPad(d.getMinutes(), 2);
    }

    onFocus(input: string) {
        this.focus = input;
    }

    equalsDatetime(date1: Date, date2: Date) {
        return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate() && date1.getHours() == date2.getHours() && date1.getMinutes() == date2.getMinutes();
    }

    existsDatetime(model: any) {
        for (let h of this.hours) {
            if (this.equalsDatetime(this.parseDate(h.dateFrom), this.parseDate(model.dateFrom)) && h.professional.id == model.professional.id) {
                return true;
            }
        }
        return false;
    }

    buildModel(date: Date) {
        let model: any = {};
        let now: Date = new Date();
        let dateFrom: Date = new Date(+date);
        let dateTo: Date = new Date(+dateFrom);
        this.model.start = this.model.start ? this.model.start.toString().replace(/ /g, '') : this.model.start;
        this.model.end = this.model.end ? this.model.end.toString().replace(/ /g, '') : this.model.end;
        if (!this.professional || !this.professional.id) {
            this.dialog('Indique un Profesional');
            return null;
        }
        if (!this.model.start || !this.model.end) {
            this.dialog('Indique un horario');
            return null;
        }
        if (this.model.start.length <= 2) {
            this.model.start += ':00';
        }
        let hhmm: string[] = this.model.start.split(":");
        if (isNaN(+hhmm[0]) || isNaN(+hhmm[1])) {
            this.dialog('Horario incorrecto');
            return null;
        }
        if (+hhmm[0] < 0 || +hhmm[0] > 23 || +hhmm[1] < 0 || +hhmm[1] > 59) {
            this.dialog('Horario incorrecto');
            return null;
        }
        dateFrom.setHours(+hhmm[0]);
        dateFrom.setMinutes(+hhmm[1]);
        if (this.model.end.length <= 2) {
            this.model.end += ':00';
        }
        hhmm = this.model.end.split(":");
        if (isNaN(+hhmm[0]) || isNaN(+hhmm[1])) {
            this.dialog('Horario incorrecto');
            return null;
        }
        if (+hhmm[0] < 0 || +hhmm[0] > 23 || +hhmm[1] < 0 || +hhmm[1] > 59) {
            this.dialog('Horario incorrecto');
            return null;
        }
        dateTo.setHours(+hhmm[0]);
        dateTo.setMinutes(+hhmm[1]);
        if (+dateFrom > +dateTo) {
            this.dialog('Horario incorrecto');
            return null;
        }
        model.dateFrom = this.formatFullDate(dateFrom);
        model.dateTo = this.formatFullDate(dateTo);
        //Chequeo de fecha menor a la de hoy
        let fecha1 = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate(), dateFrom.getHours(), dateFrom.getMinutes());
        let fecha2 = new Date();

        if (fecha1 < fecha2) {
            this.dialog('No se puede indicar un horario menor al actual');
            return null;
        }
        model.professional = this.professional;
        model.service = { id: this.serviceId };
        model.touched = true;
        return model;
    }

    private addDays(date: Date, days: number) {
        let result = new Date(+date);
        result.setDate(result.getDate() + days);
        return result;
    }

    add() {
        // // console.log("object");
        // this.snackBar.open('hola', 'action', {
        //     duration: 10000,
        // });
        let dates: Date[] = [];
        let model: any;
        if (this.model.allmonth) {
            let currentDate: Date = this.model.date ? new Date(this.model.date.getFullYear(), this.model.date.getMonth(), 1) : new Date(Date.now());
            let currentMonth: number = currentDate.getMonth();
            while (currentDate.getMonth() == currentMonth) {
                dates.push(new Date(+currentDate));
                currentDate = this.addDays(currentDate, 1);
            }
        }
        else {
            dates.push(this.model.date);
        }
        for (let d of dates) {
            model = this.buildModel(d);
            if (!model) {
                return;
            }
            if (!model.removed && !this.existsDatetime(model)) {
                this.hours.push(model);
                this.sendChanges();
            }
        }
        this.hours = this.hours.sort((a, b) => this.parseDate(a.dateFrom) - this.parseDate(b.dateFrom));
        // $.notify({
        //     title: 'Horario Agregado',
        //     message: 'Recuerde Guardar Cambios'
        // }, {
        //         type: 'minimalist',
        //         delay: 2000,
        //         icon_type: 'image',
        //         template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
        //             '<span data-notify="title">{1}</span>' +
        //             '<span data-notify="message">{2}</span>' +
        //             '</div>'
        //     });
    }

    remove(index: number) {
        let really = this;
        swal({
            title: '¿Está seguro de Eliminar?',
            text: '',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f44336',
            //cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        }).then(function () {
            console.log("ok");
            let planning = really.hours[index];
            really.planningService.deleteServicePlanning(planning).subscribe((response: any) => {
                really.planningService.getServicePlanning(really.service.id).subscribe((response: any) => {
                    really.hours = response;
                },
                    error => {
                        if (error.status == 409) {
                            really.dialog(JSON.parse(error._body).result);
                        }
                    })
            },
                error => {
                    if (error.status == 409) {
                        really.dialog(JSON.parse(error._body).result);
                    }
                })
            // really.router.navigateByUrl('/today/' + really.consultation.schedule.id + '/consultation')
            // window.history.back();            
        });
        // this.addOrDelete = 'delete';
        // this.hours[index].touched = true;
        // this.hours[index].removed = true;
        // $.notify({
        //     title: 'Horario Eliminado',
        //     message: 'Recuerde Guardar Cambios'
        // }, {
        //         type: 'minimalist',
        //         delay: 2000,
        //         icon_type: 'image',
        //         template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
        //             '<span data-notify="title">{1}</span>' +
        //             '<span data-notify="message">{2}</span>' +
        //             '</div>'
        //     });
        //this.hours.splice(index, 1);
    }

    deleteRecords() {
        let really = this;
        if (this.hoursToDelete.length == 0) {
            this.planningService.getServicePlanning(this.serviceId).subscribe((plannings: any) => {
                this.hours = plannings;
                this.hours = this.hours.sort((a, b) => this.parseDate(a.dateFrom) - this.parseDate(b.dateFrom));
            },
                error => {
                    // console.log(error);
                    if (error.status == 409) {
                        really.dialog(JSON.parse(error._body).result);
                    }
                });
            // this.router.navigateByUrl('/careservicelist');
        }
        else {
            this.planningService.deleteServicePlanning(this.hoursToDelete[0]).subscribe(response => {
                really.hoursToDelete = really.hoursToDelete.splice(1);
                really.deleteRecords();
                really.planningService.getServicePlanning(this.serviceId).subscribe((plannings: any) => {
                    this.hours = plannings;
                    this.hours = this.hours.sort((a, b) => this.parseDate(a.dateFrom) - this.parseDate(b.dateFrom));
                },
                    error => {
                        if (error.status == 409) {
                            really.dialog(JSON.parse(error._body).result);
                        }
                    });
            },
                error => {
                    really.planningService.getServicePlanning(this.serviceId).subscribe((plannings: any) => {
                        really.hours = plannings;
                        really.hours = this.hours.sort((a, b) => this.parseDate(a.dateFrom) - this.parseDate(b.dateFrom));
                    });
                    // console.log(error);
                    if (error.status == 409) {
                        really.dialog(JSON.parse(error._body).result);
                    }
                });
        }
    }

    sendChanges() {
        let really = this;
        // this.model.hourFrom += ':00';
        // this.model.hourTo += ':00';
        // console.log(this.model);
        // console.log(this.model.dateFrom.toString());
        if (this.model.professional && this.model.professional.id && this.model.dateFrom && this.model.hourFrom && this.model.hourTo) {
            let dateFromAux = this.model.dateFrom;
            let month = this.model.dateFrom.getMonth() + 1;
            month = month < 10 ? '0' + month : month;
            this.model.dateFrom = this.model.dateFrom.getDate() + '-' + month + '-' + this.model.dateFrom.getFullYear() + ' 00:00:00';
            this.model.service = this.service;
            this.careserviceService.planningCareservice(this.model, 1).subscribe((response: any) => {
                console.log(response);
                really.hours.push(this.model);
                really.model = {};
                really.planningService.getServicePlanning(really.service.id).subscribe((planning: any) => {
                    really.hours = planning;
                })
            }, error => {
                console.log(error);
                let msg = JSON.parse(error._body).message;
                if (error.status == '409') {
                    swal({
                        title: '¿Desea Asignar de todos Modos?',
                        text: msg,
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#f44336',
                        //cancelButtonColor: '#d33',
                        confirmButtonText: 'Continuar',
                        cancelButtonText: 'Cancelar'
                    }).then(function () {
                        really.careserviceService.planningCareservice(really.model, 0).subscribe((response: any) => {
                            console.log(response);
                            really.hours.push(really.model);
                            really.model = {};
                            really.planningService.getServicePlanning(really.service.id).subscribe((planning: any) => {
                                really.hours = planning;
                            })
                        }, error => {
                            really.model.dateFrom = dateFromAux;
                            really.model = {};
                            really.dialog(JSON.parse(error._body).message);

                        })
                    });
                }
                else if (error.status == '400') {
                    really.model.dateFrom = dateFromAux;
                    really.dialog(JSON.parse(error._body).message)
                }
            })
        }
        else {
            if (!this.model.professional || !this.model.professional.id) {
                this.dialog('Ingrese un Profesional válido');
            }
            else {
                this.dialog('Ingrese todos los datos correspondientes');
            }

        }

        // if (this.addOrDelete == 'add') {
        //     let dates: Date[] = [];
        //     let model: any;
        //     if (this.model.allmonth) {
        //         let currentDate: Date = this.model.date ? new Date(this.model.date.getFullYear(), this.model.date.getMonth(), 1) : new Date(Date.now());
        //         let currentMonth: number = currentDate.getMonth();
        //         while (currentDate.getMonth() == currentMonth) {
        //             dates.push(new Date(+currentDate));
        //             currentDate = this.addDays(currentDate, 1);
        //         }
        //     }
        //     else {
        //         dates.push(this.model.date);
        //     }
        //     for (let d of dates) {
        //         model = this.buildModel(d);
        //         if (!model) {
        //             return;
        //         }
        //         if (!model.removed && !this.existsDatetime(model)) {
        //             this.hours.push(model);
        //         }
        //     }
        //     this.hours = this.hours.sort((a, b) => this.parseDate(a.dateFrom) - this.parseDate(b.dateFrom));

        // }
        // let really = this;
        // let changed: any[] = [];
        // let newObj: any;
        // for (let h of this.hours) {
        //     if (h.touched) {
        //         newObj = JSON.parse(JSON.stringify(h));
        //         newObj.professional = {
        //             id: newObj.professional.id
        //         };
        //         if (newObj.id) {
        //             this.hoursToDelete.push(newObj);
        //         }
        //         else {
        //             changed.push(newObj);
        //         }
        //     }
        // }
        // if (changed.length > 0) {
        //     this.planningService.postServicePlanning(changed).subscribe(response => {
        //         this.deleteRecords();
        //     },
        //         error => {
        //             // console.log(error);
        //             if (error.status == 409) {
        //                 really.planningService.getServicePlanning(this.serviceId).subscribe((plannings: any) => {
        //                     really.hours = plannings;
        //                     really.hours = this.hours.sort((a, b) => this.parseDate(a.dateFrom) - this.parseDate(b.dateFrom));
        //                 });
        //                 this.dialog(JSON.parse(error._body).result);
        //                 // this.dialog('SE PRODUJO UN ERROR');
        //             }
        //         });
        // }
        // else {
        //     this.deleteRecords();
        // }
        // this.addOrDelete = 'add';
    }
    displayFn(center: any) {
        // console.log(center);
        return center ? center.person.lastName + ', ' + center.person.firstName : center;
    }
}
