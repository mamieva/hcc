import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DateAdapter } from '@angular/material';

import { PersonService } from '../../services/person.service';
import { ScheduleService } from '../../services/schedule.service';
import { ProfessionalService } from '../../services/professional.service';
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
    selector: 'receipt-cmp',
    templateUrl: 'receipt.component.html'
})

export class ReceiptComponent implements OnInit {
    //Propiedades
    professionalCtrl: FormControl;
    filteredProfessionals: Observable<any[]>;
    professionals: any;
    receipt: any = { date: null, professional: null, blob: null };
    aux: any;
    //    
    search: any = '';
    page: any = '';
    size: any = '';
    totalPages: number;
    fecha: any = '';
    professionalSelected: any[] = [];
    maxDate: Date = new Date();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private professionalService: ProfessionalService,
        private reportsService: ReportsService,
        private dateAdapter: DateAdapter<Date>
    ) {
        //Definir control para el autocompletar
        this.professionalCtrl = new FormControl();
        //Setear Locale de la fecha
        this.dateAdapter.setLocale('es-AR');
        //Obtener todos los Profesionales para el autocompletar
        professionalService.getAllProfessionals().subscribe((response: any) => {
            // console.log('professional', response);
            this.professionals = response.content;
            this.aux = response.content;
            // Asignar los cambios del filtro
            this.filteredProfessionals = this.professionalCtrl.valueChanges
                .debounceTime(200)
                .startWith(null)
                .map((professional: any) => {
                    if (professional && typeof professional !== 'object') {
                        // let search = 'firstName=' + professional + '&lastName=' + professional + '&matricula=' + professional;
                        this.professionalService.getProfessionals(professional, this.page, this.size).map(response => response).subscribe((response: any) => {
                            // console.log('responde', response);
                            if (response.content.length > 0) {
                                this.aux = response.content;
                            }
                        });
                        return this.aux.filter((ser: any) =>
                            ser.person.firstName.toString().toUpperCase().indexOf(professional.toString().toUpperCase()) >= 0 ||
                            ser.person.lastName.toString().toUpperCase().indexOf(professional.toString().toUpperCase()) >= 0 ||
                            ser.matricula.toString().toUpperCase().indexOf(professional.toString().toUpperCase()) >= 0
                        );
                    }
                    else {
                        return this.professionals.slice();
                    }
                })
            //
        });
    }

    ngOnInit() {
        document.querySelector('#top').scrollIntoView({ behavior: 'smooth' });
    }

    filterProfessional(name: string) {
        //Hacer peticion de busqueda
        // let search: any;
        // search = '&name=' + name + '&matricula=' + name;
        // this.professionalService.getProfessionals(search).subscribe((response: any)=>{
        //     // console.log(response);
        // });
        //...
        return this.professionals.filter((professional: any) =>
            professional.person.firstName.toString().toUpperCase().indexOf(name.toString().toUpperCase()) >= 0 ||
            professional.person.lastName.toString().toUpperCase().indexOf(name.toString().toUpperCase()) >= 0 ||
            professional.matricula.toString().toUpperCase().indexOf(name.toString().toUpperCase()) >= 0
        );
    }
    onSubmit() {
        // console.log(this.receipt);
        let year = new Date(this.receipt.date).getFullYear();
        if (year != 1969) {
            let day = new Date(this.receipt.date).toLocaleDateString();
            // let professional = this.receipt.professional ? this.receipt.professional.id : '-1';
            let professional: any = this.professionalSelected.map((elem) => {
                return elem.id;
            })
            professional = professional.length > 0 ? professional.toString() : '-1';
            this.reportsService.getAttention(day, professional).subscribe((response: any) => {
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
                if (error.status == 500 || error.status == 401) {
                    this.dialog(JSON.parse(error._body).message)
                }
                else {
                    let msg = JSON.parse(error._body).pdf;
                    this.dialog(msg);
                }
            });
            this.fecha = this.receipt.date.toLocaleDateString();
            console.log(this.fecha);

        }
        else {

            this.dialog('Ingrese una Fecha Válida');
        }
        // window.open("data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G", "mypdf", "width=700px,height=600px");


    }
    displayFn(professional: any) {
        // console.log(professional);
        return professional && professional.matricula ? professional.matricula + ' - ' + professional.person.lastName + ', ' + professional.person.firstName : '';
    }
    dialog(msg: string) {
        swal({
            title: msg,
            animation: false,
            customClass: 'animated tada',
            confirmButtonColor: '#f44336'
        });
    }
    deleteProfessional(index: any) {
        this.professionalSelected.splice(index, 1);
    }
    selectProfessional(service: any) {
        // console.log(typeof(service));
        if (service && service.id)
            if (this.professionalSelected.filter((element) => {
                return element.id == service.id
            }).length == 0) {
                this.professionalSelected.push(service);
                this.receipt.professional = { person: {} };
            }
            else {
                this.dialog('Ya ha ingresado el Servicio');
            }
    }
    reset() {
        this.receipt.date = null;
        this.receipt = {};
        this.professionalSelected = [];
    }

}
