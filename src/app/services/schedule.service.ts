import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiClientService } from './util/api.client.service';
import { ScheduleComponent } from '../schedule/schedule.component';
import { AppSettings } from './../app.settings';

declare const $: any;
declare const moment: any;
declare const swal: any;

@Injectable()
export class ScheduleService {

    localServiceInterconsultation: any;
    isInterConsultation: boolean = false;

    constructor(private http: ApiClientService,
        private route: ActivatedRoute,
        private router: Router) { }

    getSchedules(serviceId: number) {
        return this.http.get('/schedule/service/all?serviceId=' + serviceId);
    }

    getSchedulesInterconsultation(serviceId: number, personId: number) {
        return this.http.get('/schedule/service/interconsultation/all?serviceId=' + serviceId + '&personId=' + personId);
    }

    generateOrder(scheduleId: number) {
        return this.http.get('/schedule/' + scheduleId + '/charge');
    }
    postOrder(scheduleId: number, schedule: any) {
        return this.http.post('/schedule/' + scheduleId + '/charge', schedule);
    }

    cancelSchedule(schedule: any) {
        return this.http.put('/schedule/' + schedule.id, schedule);
    }

    cancelScheduleTelemedicine(schedule: any) {
        return this.http.put('/cancel/schedule/' + schedule.id + '/telemedicine', schedule);
    }
    getSchedule(scheduleId: any) {
        return this.http.get('/schedule/' + scheduleId);
    }

    saveSchedule(schedule: any) {
        let aux: any = {};

        aux = Object.assign(aux, schedule);
        if (schedule.person) {
            // aux = { id: schedule.person.id };
            aux.person = { id: schedule.person.id };
        }
        else {
            aux.person = null;
        }
        if (schedule.id) {
            return this.assignSchedule(aux);
        }
        else {
            return this.createSchedule(aux);
        }
    }

    sendChanges(cmp: any, schedules: any[]) {
        // debugger
        let schedulesToSend: any[] = [];
        for (let schedule of schedules) {
            delete schedule.arrivalTime;
            if (schedule.touched) {
                schedulesToSend.push(schedule);
            }
        }
        this.sendSchedules(cmp, schedulesToSend);
    }
    sendChangesInterconsultation(schedules: any[], localService: any) {
        this.localServiceInterconsultation = localService;
        let schedulesToSend: any[] = [];
        for (let schedule of schedules) {
            delete schedule.arrivalTime;
            if (schedule.touched) {
                schedulesToSend.push(schedule);
            }
        }
        this.sendSchedules('', schedulesToSend);
    }

    sendSchedules(cmp: any, schedulesToSend: any[]) {
        let response: any;
        if (schedulesToSend.length > 0) {
            if (schedulesToSend[0].telemedicine) {
                response = this.saveSchedule(schedulesToSend[0]);
                // console.log(response);
                schedulesToSend = schedulesToSend.splice(1);
                this.sendSchedules(cmp, schedulesToSend);
            }
            else {
                this.saveSchedule(schedulesToSend[0]).subscribe((saveSchedule: any) => {

                    // let scheduleAssigned: any[] = [];
                    // if (cmp != '' && cmp.service.typeService == 'DEM')
                    //     cmp.getSchedules();
                    // schedulesToSend = schedulesToSend.splice(1);
                    // cmp.schedules.forEach((schedule: any) => {
                    //     if (!schedule.id)
                    //         debugger
                    //     let aux = saveSchedule.filter((resp: any) => {
                    //         return resp.id == schedule.id;
                    //     });
                    //     schedule.touched = false;
                    //     if (!aux[0] && !schedule.overSchedule)
                    //         schedule.person = null;
                    //     let dummy = aux[0] ? aux[0] : schedule;
                    //     if (dummy.id)
                    //         scheduleAssigned.push(dummy)
                    // });
                    // cmp.calendarAlreadyRendered = false;
                    cmp.getSchedules();
                    // $("#fullCalendar").html = '';
                    // this.initCalendar(cmp, scheduleAssigned, cmp.service.duration, false);
                    // this.sendSchedules(cmp, schedulesToSend);
                }, (error: any) => {
                    cmp.getSchedules();
                    // this.initCalendar(cmp, cmp.schedules, cmp.service.duration, false);
                    let message = JSON.parse(error._body).message;
                    swal({
                        title: message,
                        animation: false,
                        customClass: 'animated ',
                        confirmButtonColor: '#f44336'
                    });
                });
            }
        }
        else {
            // swal({
            //     title: '!',
            //     confirmButtonColor: '#f44336'
            // });
            // debugger
            // setTimeout(() => {
            //     if (!response)
            //         this.router.navigate(['today']);
            // }, 4000);

            // // console.log(object);
            // window.location.reload();
        }
    }

    setPhoto(person: any) {
        if (person.photoBase64 && !person.photoBase64.startsWith('/assets/')) {
            person.photoBase64 = 'data:image;base64,' + person.photoBase64;
        }
        else {
            let genre: string;
            if (person.sex == 'F') {
                genre = 'woman';
            }
            else {
                genre = 'man';
            }
            person.photoBase64 = '/assets/img/silhouette-' + genre + '-grey.png';
        }
    }

    addOnDemand(cmp: any, schedules: any[]) {
        let now: Date = new Date();
        let eventData: any = {
            id: +new Date(),
            title: '',
            start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            allDay: true,
            className: 'event-red'
        };
        this.addOverSchedule(cmp, schedules, eventData);
    }

    initCalendar(cmp: any, rawEvents: any[], duration: number, isInterConsultation: any) {
        // debugger

        // let really = this;
        this.isInterConsultation = isInterConsultation;
        let reallythis = this;
        cmp.showCalendar = true;
        cmp.schedules = rawEvents;
        let events: any[] = this.generateEvents(rawEvents);
        const $calendar = $('#fullCalendar');
        if (cmp.calendarAlreadyRendered) {
            let i: number;
            $calendar.fullCalendar('removeEvents');
            $calendar.fullCalendar('addEventSource', events)
            // for (i = 0; i < events.length; i++) {
            //     $calendar.fullCalendar('renderEvent', events[i], true); // stick? = true
            // }
            $calendar.fullCalendar('unselect');
            return;
        }
        else {
            cmp.calendarAlreadyRendered = true;
        }

        const today = new Date();
        today.setHours(today.getHours() - 1);
        const y = today.getFullYear();
        const m = today.getMonth();
        const d = today.getDate();
        const ev = events;
        const slotDuration = '00:' + (duration ? duration : 15) + ':00';
        const srv: ScheduleService = this;

        $calendar.fullCalendar({
            viewRender: function (view: any, element: any) {
                // We make sure that we activate the perfect scrollbar when the view isn't on Month
                /*if (view.name !== 'month') {
                    const $fc_scroller = $('.fc-scroller');
                    $fc_scroller.perfectScrollbar();
                }*/
            },
            header: {
                left: 'title',
                center: 'agendaWeek, agendaDay',
                right: 'prev, next, today'
            },
            height: 500,
            defaultView: 'agendaWeek',
            allDaySlot: true,
            allDayHtml: 'Sobreturno',
            groupByResource: true,
            //minTime: '08:00:00',
            slotDuration: '00:05:00',
            slotLabelInterval: '00:05:00',
            slotLabelFormat: 'HH:mm',
            defaultDate: today,
            scrollTime: '' + today.getHours() + ':00',
            selectable: true,
            selectHelper: false,
            editable: false,
            eventLimit: true, // allow "more" link when too many events

            // color classes: [ event-blue | event-azure | event-green | event-orange | event-red ]
            events: ev,
            displayEventTime: false,
            views: {
                /*month: { // name of view
                    titleFormat: 'MMMM YYYY'
                    // other view-specific options here
                },*/
                // week: {
                //     titleFormat: ' D MMMM YYYY'
                // }
                //,
                day: {
                    titleFormat: 'D MMM, YYYY'
                }
            },
            eventClick: function (event: any, element: any) {
                console.log(event);
                // debugger
                if (event.className == "event-green") {
                    if (cmp.checkPatienceSelected()) {
                        // debugger
                        swal({
                            title: 'Asignar Turno',
                            text: moment(event.start).format('DD/MM/YYYY, h:mm:ss a') + ' - ' + cmp.patience.lastName + ', ' + cmp.patience.firstName,
                            type: 'info',
                            showCancelButton: true,
                            confirmButtonColor: '#f44336',
                            //cancelButtonColor: '#d33',
                            confirmButtonText: 'Asignar Turno e Imprimir Ticket',
                            cancelButtonText: 'Cancelar'
                        }).then(function () {
                            //$calendar.fullCalendar('removeEvents', event._id);
                            event.title = cmp.patience.lastName + ', ' + cmp.patience.firstName;
                            event.className = 'event-red';
                            reallythis.imprimirTicket(cmp, event);
                            srv.addSchedule(cmp, event.id);
                            $calendar.fullCalendar('updateEvent', event);
                        }, function (dismiss: any) {
                            if (dismiss === 'cancel') { // you might also handle 'close' or 'timer' if you used those
                                // ignore
                            } else {
                                throw dismiss;
                            }
                        })
                    }
                }
                // else if (!cmp.patience || (cmp.patience.docNumber == event.person.docNumber && cmp.patience.sex == event.person.sex)) {
                else if (event.className == "event-red") {
                    let to: Date = new Date(event.end);
                    // cmp.patience = event.person;
                    // srv.setPhoto(cmp.patience);
                    // console.log(cmp.patience);
                    if (new Date(event.start).getDate() != to.getDate()) {
                        // console.log("elimina1");
                        // srv.removeOverSchedule(cmp, event);
                        // $calendar.fullCalendar('removeEvents', event._id);

                        let scheduleDumm: any = cmp.schedules.filter((element: any) => {
                            return element.id == event.id
                        });
                        swal({
                            title: 'Eliminar Turno',
                            text: 'Desea Eliminar el turno de ' + scheduleDumm[0].person.lastName + ', ' + scheduleDumm[0].person.firstName + ' - DU: ' + scheduleDumm[0].person.docNumber,
                            type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#f44336',
                            //cancelButtonColor: '#d33',
                            confirmButtonText: 'Eliminar',
                            cancelButtonText: 'Cancelar'
                        }).then(function () {
                            // console.log("elimina");
                            // event.title = 'Disponible';
                            // event.className = 'event-green';
                            srv.removeOverSchedule(cmp, event);
                            $calendar.fullCalendar('removeEvents', event._id);
                            // $calendar.fullCalendar('updateEvent', event);
                        }, function (dismiss: any) {
                            if (dismiss === 'cancel') { // you might also handle 'close' or 'timer' if you used those
                                // ignore
                            } else {
                                throw dismiss;
                            }
                        })
                    }
                    else {
                        let scheduleDumm: any = cmp.schedules.filter((element: any) => {
                            return element.id == event.id
                        });
                        swal({
                            title: 'Eliminar Turno',
                            text: 'Desea Eliminar el turno de ' + scheduleDumm[0].person.lastName + ', ' + scheduleDumm[0].person.firstName + ' - DU: ' + scheduleDumm[0].person.docNumber,
                            type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#f44336',
                            //cancelButtonColor: '#d33',
                            confirmButtonText: 'Eliminar',
                            cancelButtonText: 'Cancelar'
                        }).then(function () {
                            // console.log("elimina");
                            event.title = 'Disponible';
                            event.className = 'event-green';
                            srv.removeSchedule(cmp, event.id);
                            $calendar.fullCalendar('updateEvent', event);
                        }, function (dismiss: any) {
                            if (dismiss === 'cancel') { // you might also handle 'close' or 'timer' if you used those
                                // ignore
                            } else {
                                throw dismiss;
                            }
                        })
                    }
                }
            },
            select: function (start: any, end: any) {
                // console.log(start);
                // debugger
                if (!reallythis.isInterConsultation) {
                    if (cmp.checkPatienceSelected()) {
                        let to: Date = new Date(end);
                        let title: string = cmp.patience.lastName + ', ' + cmp.patience.firstName;
                        if (new Date(start).getDate() != to.getDate() && !srv.existsInOverSchedule($calendar.fullCalendar('clientEvents'), to, title)) {
                            let eventData: any = {
                                id: +new Date(),
                                title: title,
                                start: new Date(to.getFullYear(), to.getMonth(), to.getDate()),
                                allDay: true,
                                className: 'event-red'
                            };

                            // console.log("entra", this.isInterConsultation);
                            srv.addOverSchedule(cmp, cmp.schedules, eventData);
                            $calendar.fullCalendar('renderEvent', eventData, true); // stick? = true

                            $calendar.fullCalendar('unselect');
                        }
                    }
                }
                else {
                    swal({
                        title: 'No se pueden asignar Sobreturnos en Interconsultas',
                        confirmButtonColor: '#f44336'
                    });
                }
            }
        });
        $calendar.fullCalendar('render');
    }

    generateEvents(schresp: any[]) {
        let events: any[] = [];
        for (let schedule of schresp)
            events.push(this.buildEvent(schedule));
        // console.log('EVENTOS',JSON.stringify(events));
        return events;
    }

    filterTodaySchedules(schedules: any[]) {
        let result: any[] = [];
        let now: Date = new Date();
        for (let s of schedules) {
            if (this.equalsDate(now, this.parseDate(s.scheduledDateFrom))) {
                result.push(s);
            }
        }
        return result;
    }

    filterTodayPlannings(plannings: any[]) {
        let result: any[] = [];
        let now: Date = new Date();
        for (let p of plannings) {
            if (this.equalsDate(now, this.parseDate(p.dateFrom))) {
                result.push(p);
            }
        }
        return result;
    }

    imprimirTicket(cmp: any, evento: any) {
        let really = this;
        // debugger
        // let msg = "<ticket><header><field id=\"8\" type=\"text\" font=\"10\" align=\"center\" weight=\"bold\"><texts><text>Turno Medico</text></texts></field></header><body><title id=\"7\" type=\"text\" font=\"20\" align=\"center\" weight=\"bold\"><texts><text>"+cmp.service.name+"</text><text>"+(cmp.service.locationInstructions ? cmp.service.locationInstructions : '')+"</text></texts></title><rows><row><label id=\"6\" type=\"text\" font=\"0\" weight=\"bold\"><texts><text>Nombre y apellido: </text></texts></label><field id=\"5\" type=\"text\" font=\"16\" weight=\"light\"><texts><text>" + cmp.patience.firstName+ ", " + cmp.patience.lastName + "</text></texts></field></row><row><label id=\"4\" type=\"text\" font=\"0\" weight=\"bold\"><texts><text>DNI: </text></texts></label><field id=\"3\" type=\"number\" font=\"16\" weight=\"light\"><texts><text>" + cmp.patience.docNumber + "</text></texts></field></row><row><label id=\"2\" align=\"center\" type=\"text\" font=\"0\" weight=\"bold\"><texts><text>Fecha y Hora: </text></texts></label><field id=\"1\" type=\"text\" font=\"16\" weight=\"light\"><texts><text>" + moment(evento.start).format('DD/MM/YYYY HH:MM') + "</text></texts></field></row></rows></body><footer><field type=\"text\" font=\"24\" align=\"center\"><texts><text>" + cmp.service.healthCenter.name + "</text><text>" + cmp.service.healthCenter.address + "</text><text>Tel: " + cmp.service.healthCenter.phone + "</text></texts></field></footer></ticket>";
        // console.log(msg);
        let msg = "<ticket><header><field id=\"10\" type=\"text\" font=\"10\" align=\"center\" weight=\"bold\"><texts><text> - REGISTROS MEDICOS 3.0 - </text><text> TURNO MEDICO </text><text>------------------------------------------</text></texts></field></header><body><rows><row><label id=\"12\" align=\"center\" type=\"text\" font=\"10\" weight=\"bold\"><texts><text>Horario: </text></texts></label><field id=\"11\" align=\"center\" type=\"number\" font=\"20\" weight=\"bold\"><texts><text>" + moment(evento.start).format('DD/MM/YYYY, h:mm:ss a') + "</text></texts></field></row><row><label id=\"8\" align=\"center\" type=\"text\" font=\"30\" weight=\"bold\"><texts><text>" + cmp.service.locationInstructions + "</text></texts></label><field id=\"5\" align=\"center\" type=\"number\" font=\"0\" weight=\"bold\"><texts><text></text></texts></field></row><row><label id=\"12\" align=\"center\" type=\"text\" font=\"10\" weight=\"bold\"><texts><text>Servicio Medico</text></texts></label><field id=\"11\" align=\"center\" type=\"number\" font=\"0\" weight=\"bold\"><texts><text></text></texts></field></row><row><label id=\"12\" align=\"center\" type=\"text\" font=\"26\" weight=\"bold\"><texts><text>"+cmp.service.name+"</text></texts></label><field id=\"11\" align=\"center\" type=\"number\" font=\"0\" weight=\"bold\"><texts><text></text></texts></field></row><row><label id=\"8\" align=\"center\" type=\"text\" font=\"10\" weight=\"light\"><texts><text>Paciente</text></texts></label><field id=\"7\" align=\"center\" type=\"number\" font=\"0\" weight=\"bold\"><texts><text></text></texts></field></row><row><label id=\"6\" align=\"center\" type=\"text\" font=\"26\" weight=\"light\"><texts><text>" + cmp.patience.lastName+ ", " + cmp.patience.firstName + "</text></texts></label><field id=\"5\" align=\"center\" type=\"number\" font=\"0\" weight=\"bold\"><texts><text></text></texts></field></row></rows></body><footer><field type=\"text\" font=\"10\" align=\"center\" weight=\"bold\"><texts><text>------------------------------------------</text></texts></field><field type=\"text\" font=\"24\" align=\"center\" weight=\"bold\"><texts><text>" + cmp.service.healthCenter.name + "</text><text>" + cmp.service.healthCenter.address + "</text><text>Tel: " + cmp.service.healthCenter.phone + "</text></texts></field></footer></ticket>"
        var ws = new WebSocket(`ws://${AppSettings.PRINTER_URL}`);
        ws.binaryType = "arraybuffer";
        // ws.bufferedAmount = 1000;
        ws.onopen = function (event) {
            ws.send(msg)
        };

        ws.onmessage = function (evt) {
            console.log("Connection onmessage!!!...");

        };
        ws.onclose = function () {
            // websocket is closed.
            console.log("Connection is closed...");
        };
        ws.onerror = function (event) {
            // websocket is closed.
            console.log("Error");
        };
    }
    expiredPlanning(plannings: any[]) {
        // debugger
        let now: Date = new Date();
        for (let p of plannings) {
            if (+now <= +this.parseDate(p.dateTo)) {
                return false;
            }
        }
        return true;
    }

    private parseDate(str: string) {
        // console.log(moment(str, 'DD-MM-YYYY HH:mm:ss').toDate());
        return moment(str, 'DD-MM-YYYY HH:mm:ss').toDate();
    }

    private toDate(milliseconds: number) {
        let d: Date = new Date(milliseconds);
        return d.toLocaleString('es-AR');
    }

    private addOverSchedule(cmp: ScheduleComponent, schedules: any, event: any) {
        for (let schedule of schedules) {
            if (schedule.overSchedule && event.title == schedule.title && this.equalsDate(event.start, schedule.scheduledDateFrom)) {
                return;
            }
        }
        schedules.push({
            overSchedule: true,
            scheduledDateFrom: event.start,
            scheduledDateTo: event.start,
            status: 'ACT',
            person: cmp.patience,
            service: cmp.service,
            touched: true
        });
        cmp.sendChanges();
    }

    private removeOverSchedule(cmp: ScheduleComponent, event: any) {
        // debugger
        let i: number = 0;
        let title: string;
        for (let schedule of cmp.schedules) {
            if (schedule.person) {
                title = schedule.person.lastName + ', ' + schedule.person.firstName;
                if (schedule.overSchedule && event.title == title && this.equalsDate(this.addDays(new Date(event.start), 1), this.parseDate(schedule.scheduledDateFrom))) {
                    if (schedule.id) {
                        schedule.status = 'CAN';
                        schedule.touched = true;
                    }
                    else {
                        cmp.schedules.splice(i, 1);
                    }
                    cmp.sendChanges();
                    return;
                }
            }
            i++;
        }

    }

    private addSchedule(cmp: ScheduleComponent, scheduleId: number) {
        // for (let schedule of cmp.schedules) {
        cmp.schedules = cmp.schedules.map((schedule: any) => {
            if (schedule.id == scheduleId) {
                // debugger
                schedule.person = cmp.patience;
                schedule.freeSchedule = false;
                schedule.touched = true;
                // break;
            }
            return schedule;
        })
        // }
        cmp.sendChanges();
    }

    private removeSchedule(cmp: ScheduleComponent, scheduleId: number) {
        // debugger
        cmp.schedules = cmp.schedules.map((schedule: any) => {
            if (schedule.id == scheduleId) {
                // debugger
                schedule.person = null;
                schedule.freeSchedule = true;
                schedule.touched = true;
                // break;
            }
            return schedule;
        })
        cmp.sendChanges();
    }

    private createSchedule(schedule: any) {
        schedule.scheduledDateFrom = this.formatDate(schedule.scheduledDateFrom);
        schedule.scheduledDateTo = this.formatDate(schedule.scheduledDateTo);
        return this.http.post('/schedule', schedule);
    }

    private assignSchedule(schedule: any) {
        let really = this;
        //VERIFICAR SI ES DE TELEMEDICINA
        if (schedule.service.telemedicine) {
            // console.log('pasare por aqui', schedule);
            let personId = schedule.person != null ? schedule.person.id : '';
            this.http.put('/schedule/' + schedule.id + '/telemedicine?personId=' + personId + '&localServiceId=' + this.localServiceInterconsultation.id + '&overscheduled=0&createLocalPlanning=0', schedule)
                .subscribe((response) => {
                    swal({
                        title: 'Generado con Èxito!',
                        animation: false,
                        customClass: 'animated ',
                        confirmButtonColor: '#f44336'
                    });
                    return true;
                }, (error) => {
                    if (error) {
                        // console.log('error', error);
                        // console.log(JSON.parse(error._body).message);
                        let err = JSON.parse(error._body);
                        // console.log(err.status);
                        if (err.status == 400) {
                            swal({
                                title: err.message,
                                text: 'Desea Generar el Turno en el Servicio: ' + really.localServiceInterconsultation.name,
                                type: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#f44336',
                                //cancelButtonColor: '#d33',
                                confirmButtonText: 'Generar',
                                cancelButtonText: 'Cancelar'
                            }).then(function () {
                                let response = true;
                                really.http.put('/schedule/' + schedule.id + '/telemedicine?personId=' + schedule.person.id + '&localServiceId=' + really.localServiceInterconsultation.id + '&overscheduled=0&createLocalPlanning=1', schedule).subscribe((response: any) => {
                                    swal({
                                        title: 'Generado con Èxito!',
                                        animation: false,
                                        customClass: 'animated ',
                                        confirmButtonColor: '#f44336'
                                    });
                                    return true;
                                });
                                return true;
                            });
                        }
                        else if (err.status == 409) {
                            swal({
                                title: 'YA SE ENCUENTRA REGISTRADO EL TURNO',
                                text: 'Desea Generar Sobreturno en el Servicio: ' + really.localServiceInterconsultation.name,
                                type: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#f44336',
                                //cancelButtonColor: '#d33',
                                confirmButtonText: 'Generar',
                                cancelButtonText: 'Cancelar'
                            }).then(function () {
                                really.http.put('/schedule/' + schedule.id + '/telemedicine?personId=' + schedule.person.id + '&localServiceId=' + really.localServiceInterconsultation.id + '&overscheduled=1&createLocalPlanning=0', schedule).subscribe((response: any) => {
                                    swal({
                                        title: 'Generado con Èxito!',
                                        animation: false,
                                        customClass: 'animated ',
                                        confirmButtonColor: '#f44336'
                                    });
                                    return true;
                                });
                                return true;
                            });
                        }
                        else if (err.status == 406) {
                            // swal({
                            //     title: err.message,
                            //     text: 'EL SERVICIO LOCAL NO PUEDE SER DE "DEMANDA" ',
                            //     type: 'warning',
                            //     showCancelButton: true,
                            //     confirmButtonColor: '#f44336',
                            //     //cancelButtonColor: '#d33',
                            //     confirmButtonText: 'Borrar',
                            //     cancelButtonText: 'Cancelar'
                            // }).then(function () {
                            //     this.http.put('/schedule/' + schedule.id + '/telemedicine?personId=' + schedule.person.id + '&localServiceId=' + this.localServiceInterconsultation.id + '&overscheduled=0&createLocalPlanning=1', schedule)

                            // });
                            swal({
                                title: 'EL SERVICIO LOCAL TIENE QUE SER PROGRAMADO ',
                                animation: false,
                                customClass: 'animated ',
                                confirmButtonColor: '#f44336'
                            });
                            return false;
                        }
                        else {
                            swal({
                                title: 'SE PRODUJO UN ERROR EN EL SERVIDOR',
                                animation: false,
                                customClass: 'animated ',
                                confirmButtonColor: '#f44336'
                            });
                            return false;
                        }
                    }
                });
            return;
        }
        else {
            return this.http.put('/schedule/' + schedule.id, schedule);
        }
    }
    private zeroPad(num: number, places: number) {
        let zero: number = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }

    private formatDate(d: Date) {
        return this.zeroPad(d.getDate(), 2) + '-' + this.zeroPad(d.getMonth() + 1, 2) + '-' + d.getFullYear() + ' 00:00:01';
    }

    private equalsDate(date1: Date, date2: Date) {
        return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate();
    }

    private addDays(date: Date, days: number) {
        let result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    private existsInOverSchedule(events: any[], date: Date, title: string) {
        for (let event of events) {
            if (event.allDay && this.equalsDate(this.addDays(new Date(event.start), 1), date) && event.title == title) {
                return true;
            }
        }
        return false;
    }

    private buildEvent(schedule: any) {
        let start: Date = this.parseDate(schedule.scheduledDateFrom);
        let event: any;
        let title: string = schedule.person ? schedule.person.lastName + ', ' + schedule.person.firstName : '';
        let className: string = "event-red";
        if (schedule.status == 'CON' || schedule.status == 'FIN')
            className = 'event-azure';
        else if (schedule.status == 'CAN')
            className = 'event-default';
        else if (schedule.telemedicine)
            className = 'event-orange'
        else if (schedule.scheduledType == 'INT')
            className = 'event-rose'
        else
            className = 'event-red'
        if (schedule.overSchedule) {
            event = {
                id: schedule.id,
                title: schedule.status != 'CAN' ? title : title + '',
                start: new Date(start.getFullYear(), start.getMonth(), start.getDate()),
                allDay: true,
                className: className,
                person: schedule.person
            }
        }
        else {
            let end: Date = this.parseDate(schedule.scheduledDateTo);
            if (schedule.person) {
                event = {
                    id: schedule.id,
                    title: schedule.status != 'CAN' ? title : title + '',
                    start: start,
                    end: end,
                    allDay: false,
                    className: className,
                    person: schedule.person
                }
            }
            else {
                event = {
                    id: schedule.id,
                    title: 'Disponible',
                    start: start,
                    end: end,
                    allDay: false,
                    className: 'event-green'
                }
            }
        }
        return event;
    }
    assignSchedulePatience(schedule: any) {
        return this.http.post('/schedule/overSchedule', schedule);
    }
}