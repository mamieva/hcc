import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DateAdapter } from '@angular/material';

import { ScheduleService } from '../../services/schedule.service';
import { CareserviceService } from '../../services/careservice.service';
import { PersonService } from '../../services/person.service';
import { ReportsService } from '../../services/reports.service';

import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
// import { saveAs } from 'file-saver/FileSaver';

declare const moment: any;
declare const swal: any;

@Component({
    selector: 'receiptPatience-cmp',
    templateUrl: 'receiptPatience.component.html'
})

export class ReceiptPatienceComponent implements OnInit {
    //Propiedades
    serviceCtrl: FormControl;
    filteredServices: Observable<any[]>;
    services: any;
    receipt: any = { date: null, service: null, blob: null };
    aux: any;
    //    
    search: any = '';
    page: any = '';
    size: any = '';
    totalPages: number;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private personService: PersonService,
        private reportsService: ReportsService,
        private dateAdapter: DateAdapter<Date>
    ) {
        let really = this;
        //Definir control para el autocompletar
        this.serviceCtrl = new FormControl();
        //Setear Locale de la fecha
        this.dateAdapter.setLocale('es-AR');
        //Obtener todos los Servicioes para el autocompletar
        personService.getAllPersonBySearch('A').subscribe((response: any) => {
            // console.log('service', response);
            really.services = response.content;
            really.aux = response.content;
            // Asignar los cambios del filtro
            really.filteredServices = this.serviceCtrl.valueChanges
                .debounceTime(100)
                .startWith(null)
                .map((service: any) => {
                    if (service && typeof service !== 'object') {
                        // let search = 'firstName=' + service + '&lastName=' + service + '&matricula=' + service;
                        really.personService.getAllPersonBySearch(service).map(response => response).subscribe((response: any) => {
                            // console.log('responde', response);
                            if (response.content.length > 0) {
                                really.aux = response.content;
                            }
                        });
                        let auxi: any[] = really.aux.filter((ser: any) =>
                            ser.firstName.toString().toUpperCase().indexOf(service.toString().toUpperCase()) >= 0 ||
                            ser.docNumber.toString().toUpperCase().indexOf(service.toString().toUpperCase()) >= 0 ||
                            ser.lastName.toString().toUpperCase().indexOf(service.toString().toUpperCase()) >= 0
                            // ||
                            // ser.matricula.toString().toUpperCase().indexOf(service.toString().toUpperCase()) >= 0
                        );

                        return auxi;
                    }
                    else {
                        return really.services.slice();
                    }
                })
            //
        });
    }

    ngOnInit() {
    }

    filterService(name: string) {
        //Hacer peticion de busqueda
        // let search: any;
        // search = '&name=' + name + '&matricula=' + name;
        // this.serviceService.getServices(search).subscribe((response: any)=>{
        //     // console.log(response);
        // });
        //...
        return this.services.filter((service: any) =>
            service.person.firstName.toString().toUpperCase().indexOf(name.toString().toUpperCase()) >= 0 ||
            service.person.lastName.toString().toUpperCase().indexOf(name.toString().toUpperCase()) >= 0 ||
            service.matricula.toString().toUpperCase().indexOf(name.toString().toUpperCase()) >= 0
        );
    }
    onSubmit() {
        // console.log(this.receipt);
        let service = this.receipt.service ? this.receipt.service.id : '-1';
        this.reportsService.getReportPatience(service).subscribe((response: any) => {
            // let aux = 'm'+response;
            // var blob = new Blob([response.blob()], {type: 'application/pdf'});
            // var filename = 'file.pdf';
            // // console.log(blob);
            this.receipt.blob = response.pdf;
            this.receipt.name = response.name;
            // console.log(response);

            //     // saveAs(blob, filename);
            //     // // console.log(typeof response);
            //     // return response;
        }, error => {
            if (error.status == 500 || error.status == 401) {
                this.dialog(JSON.parse(error._body).message)

            }
            else {
                let msg = JSON.parse(error._body).pdf;
                this.dialog(msg);
            }
        });
        // window.open("data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G", "mypdf", "width=700px,height=600px");


    }
    displayFn(service: any) {
        // console.log(service);
        return service ? 'DU:' + service.docNumber + ' - ' + service.firstName + ' ' + service.lastName : service;
    }
    dialog(msg: string) {
        swal({
            title: msg,
            animation: false,
            customClass: 'animated tada',
            confirmButtonColor: '#f44336'
        });
    }
    reset() {
        this.receipt = {};
    }
}
