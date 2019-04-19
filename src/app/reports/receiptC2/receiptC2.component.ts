import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DateAdapter } from '@angular/material';

import { PersonService } from '../../services/person.service';
import { ScheduleService } from '../../services/schedule.service';
import { CareserviceService } from '../../services/careservice.service';
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
    selector: 'receiptC2-cmp',
    templateUrl: 'receiptC2.component.html'
})

export class ReceiptC2Component implements OnInit {
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
    servicesSelected: any[] = [];
    years: any[] = [];
    year: any;
    month: any;
    maxDate: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private careserviceService: CareserviceService,
        private reportsService: ReportsService,
        private dateAdapter: DateAdapter<Date>
    ) {
        //
        let hoy: Date = new Date();
        for (let i = 2017; i <= hoy.getFullYear(); i++)
            this.years.push(i);
        // this.maxDate = hoy.getMonth() + 1;
        // console.log(this.maxDate);
        //Definir control para el autocompletar
        this.serviceCtrl = new FormControl();
        //Setear Locale de la fecha
        this.dateAdapter.setLocale('es-AR');
        //Obtener todos los Servicioes para el autocompletar
        careserviceService.getAllSpecialties('').subscribe((response: any) => {
            // console.log('service', response);
            this.services = response.content;
            this.aux = response.content;
            // Asignar los cambios del filtro
            this.filteredServices = this.serviceCtrl.valueChanges
                .debounceTime(200)
                .startWith(null)
                .map((service: any) => {
                    if (service && typeof service !== 'object') {
                        // let search = 'firstName=' + service + '&lastName=' + service + '&matricula=' + service;
                        this.careserviceService.getAllSpecialties(service).map(response => response).subscribe((response: any) => {
                            // console.log('responde', response);
                            if (response.length > 0) {
                                this.aux = response;
                            }
                        });
                        return this.aux.filter((ser: any) =>
                            ser.name.toString().toUpperCase().indexOf(service.toString().toUpperCase()) >= 0
                            // ser.person.lastName.toString().toUpperCase().indexOf(service.toString().toUpperCase()) >= 0 ||
                            // ser.matricula.toString().toUpperCase().indexOf(service.toString().toUpperCase()) >= 0
                        );
                    }
                    else {
                        return this.services.slice();
                    }
                })
            //
        });
    }

    ngOnInit() {
    }
    changeYear(ev:any){
        console.log(ev)
        let year = new Date();
        if(ev == year.getFullYear()){
            this.maxDate = year.getMonth() + 1;
            console.log(this.maxDate);
        }
        else{
            this.maxDate = 12;
        }
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
        let month = new Date(this.receipt.date).getMonth() + 1;
        let year = new Date(this.receipt.date).getFullYear();
        // let service = this.receipt.service ? this.receipt.service.id : '-1';
        let service = this.servicesSelected.map((elem) => {
            return elem.id;
        });

        this.reportsService.getReportC2Services(service.toString(), this.month, this.year).subscribe((response: any) => {
            // let aux = 'm'+response;
            // var blob = new Blob([response.blob()], {type: 'application/pdf'});
            // var filename = 'file.pdf';
            // // console.log(blob);
            this.receipt.blob = response.pdf;
            this.receipt.name = response.pdfName;
            this.receipt.csv = response.csv;
            this.receipt.csvName = response.csvName;
            // console.log(response);

            //     // saveAs(blob, filename);
            //     // // console.log(typeof response);
            //     // return response;
        }, error => {
            console.log(JSON.parse(error._body).message);
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
    deleteService(index: any) {
        this.servicesSelected.splice(index, 1);
    }
    selectService(service: any) {
        // console.log(typeof(service));
        if (service && service.id)
            if (this.servicesSelected.filter((element) => {
                return element.id == service.id
            }).length == 0) {
                this.servicesSelected.push(service);
                this.receipt.specialties = {};
            }
            else {
                this.dialog('Ya ha ingresado la Especialidad');
            }
    }
    reset() {
        this.month = null;
        this.year = null;
        this.receipt = {};
        this.servicesSelected = [];
    }
}
