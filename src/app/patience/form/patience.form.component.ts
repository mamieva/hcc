import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DateAdapter, NativeDateAdapter } from '@angular/material';

import { PersonService } from '../../services/person.service';
import { OperatorService } from '../../services/operator.service';
import { ConsultationService } from '../../services/consultation.service';
import { HealthCenterService } from '../../services/health.center.service';
import { error } from 'selenium-webdriver';

declare const swal: any;
declare const $: any;

@Component({
    selector: 'patience-form-cmp',
    moduleId: module.id,
    templateUrl: 'patience.form.component.html'
})

export class PatienceFormComponent implements OnInit {
    title: string = "Paciente: ";
    patience: any = {country:{id:null}};
    healthCenters: any[];
    model: any = {
        typeService: "PROG"
    };
    id: number;
    docNumberSex: any;
    dateDate: any;
    countries: any[] = [];
    birthDayDate: any;
    summaryPerson: any[] = [];
    historyConsultation: any;
    interconsultationPatience: any[] = [];
    historyVaccines: any[] = [];
    now: Date = new Date();
    maxDate: any = new Date(this.now.getFullYear(), this.now.getMonth() + 1, 1);
    minDate: any = new Date(1900, 1, 1);
    interconsultShow: any;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private personService: PersonService,
        private consultationService: ConsultationService,
        dateAdapter: DateAdapter<NativeDateAdapter>,
        private healthCenterService: HealthCenterService,
        private operatorService: OperatorService) {
        dateAdapter.setLocale('es-AR');
        this.route.params.subscribe(params => {
            // this.id = +params.id;
            this.docNumberSex = params.id;
        });
        if (this.docNumberSex) {
            this.docNumberSex = this.docNumberSex.toString().replace("-", '/');
            // // console.log(this.docNumberSex.toString());
            this.personService.getByDocumentSex(this.docNumberSex).subscribe((response: any) => {
                this.patience = response;
                this.patience.country = this.patience.country ? this.patience.country : { id: null }
                this.dateDate = new Date(this.patience.birthDayDate);
                // console.log(this.dateDate);
                this.birthDayDate = this.dateDate;
            })

        }
        else {
            this.title = "Nuevo Paciente";
        }

        let operatorId = JSON.parse(localStorage.getItem('currentUser')).authToken.claims.scopes.id;

        this.operatorService.getOperator(operatorId).subscribe((response: any) => {
            // debugger;
            let roles: any[] = response.healthCenterHasOperator[0].profile.profileRoles;
            // // console.log(roles);
            if (this.contains(roles, 'INTERCONSULTATION_SHOW'))
                this.interconsultShow = true;
            // if (this.contains(roles, 'PROFESSIONAL_SCHEDULE'))
            //     this.interconsult = true;
        });

        this.personService.getCountry().subscribe((response: any) => {
            this.countries = response;
        });
    }

    ngOnInit() {
        document.querySelector('#top').scrollIntoView({ behavior: 'smooth' });
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

    changeHealthCenter(healthCenter: any) {
        this.patience.healthCenter = healthCenter;
    }

    dialog(msg: string) {
        swal({
            title: msg,
            animation: false,
            customClass: 'animated tada',
            confirmButtonColor: '#f44336'
        });
    }

    onSubmit() {
        let really = this;
        // this.patience.birthDayDate = this.patience.birthDayDate.getTime();
        let mm: number = this.birthDayDate.getMonth() + 1;
        this.patience.birthDay = this.birthDayDate.getDate() + '-' + mm + '-' + this.birthDayDate.getFullYear();
        // console.log(this.patience.birthDay);
        // if (!this.patience.healthCenter) {
        //     this.dialog("Seleccione Centro de Salud");
        //     return;
        // }
        if (this.docNumberSex) {
            this.personService.savePerson(this.patience).subscribe((response: any) => {
                // localStorage.setItem('currentPatience', JSON.stringify(this.patience));
                this.location.back();
            }, (error: any) => {
                if (error.status == 500) {
                    this.dialog("Ya se encuentra registrado un Paciente con DU: " + really.patience.docNumber)
                }
                else {
                    this.dialog(JSON.parse(error._body).message);
                }
            });
        }
        else {
            this.personService.postPerson(this.patience).subscribe((response: any) => {
                this.location.back();
            }, (error: any) => {
                if (error.status == 500) {
                    this.dialog("Ya se encuentra registrado un Paciente con DU: " + really.patience.docNumber)
                }
                else {
                    this.dialog(JSON.parse(error._body).message);
                }
            });
        }
    }

    setPhoto(person: any) {
        if (person.photoBase64 && !person.photoBase64.startsWith('/assets/')) {
            person.tmpPhoto = 'data:image;base64,' + person.photoBase64;
        }
        else {
            let genre: string;
            if (person.sex == 'F') {
                genre = 'woman';
            }
            else {
                genre = 'man';
            }
            person.tmpPhoto = '/assets/img/silhouette-' + genre + '-grey.png';
        }
    }

    close() {
        this.location.back();
    }
    getSummaryPerson() {
        let really = this;
        this.consultationService.getSummaryPerson(this.patience.id).subscribe((response: any) => {
            // console.log(response);
            this.summaryPerson = response;
        }, (error: any) => {
            $("#cerrarHistorial").click();
            let msg = JSON.parse(error._body).message;
            really.dialog(msg);
            // really.dialog("Verifique sus Permisos");
            // // console.log(error);
        })
    }
    openRowSummary(row: any) {
        let really = this;
        this.consultationService.getConsultation(row.consultationId).subscribe((response: any) => {
            // console.log(response);
            really.historyConsultation = response;
        },error =>{
            let msg = JSON.parse(error._body).message;
            really.dialog(msg);
        });
        this.consultationService.getVaccinesByConsultationId(row.consultationId).subscribe((response: any) => {
            really.historyVaccines = response;
        }, error =>{
            let msg = JSON.parse(error._body).message;
            really.dialog(msg);
        });
        // this.router.navigateByUrl('/consultation/'+ row.consultationId);    
        // location.reload();  
    }
    getInterconsultationPatience() {
        let really = this;
        this.personService.getInterconsultationPatience(this.patience.docNumber, this.patience.sex).subscribe((response: any) => {
            // console.log(response);
            this.interconsultationPatience = response;
        }, error =>{
            let msg = JSON.parse(error._body).message;
            really.dialog(msg);
        });
    }
    openToday(row :any) {
        this.router.navigate(['interconsult/' + this.patience.docNumber + '-' + this.patience.sex + '/' + row.remoteService.id]);
    }
    downloadAttachment(row: any) {
        // this.consultationService.downloadAttachment(row.pathName).subscribe((response: any) => {
        //     // console.log(response.headers._headers);
        //     // console.log(response);
        //     // console.log(Array.from(response.headers._headers)[1][1][0]);
        //     var mediaType = Array.from(response.headers._headers)[1][1][0].toString();
        //     // mediaType = mediaType.substring(0, mediaType.indexOf(';'));
        //     var blob = new Blob([(<any>response)._body], { type: mediaType });
        //     // console.log(blob);
        //     // let url = window.URL.createObjectURL(blob)
        //     // let safeurl = this.domSanitizer.bypassSecurityTrustUrl(url);
        //     // this.filedownload = safeurl;
        //     // window.open(url, '_blank')
        //     // var objectUrl = URL.createObjectURL(blob);
        //     //   window.open(objectUrl)
        //     window['saveAs'](blob, row.name);
        //     window['saveAs'](blob, row.name);
        // window['saveAs'](blob, row.name);
        // });

        let really = this;
        this.consultationService.downloadAttachment(row.pathName).subscribe((file: any) => {
            // console.log(file);
            let base64 = JSON.parse(file._body).document;
            // // console.log(file);
            // let bytes = new Uint8Array(file._body.length);
            // for (let i = 0; i < bytes.length; i++) {
            //     bytes[i] = file._body.charCodeAt(i);
            // }
            // toData
            // var mediaType = Array.from(file.headers._headers)[1][1][0].toString();
            // // let pdfSrc = new Uint8Array(file.arrayBuffer());
            // let blob = new Blob([file._body], { type: mediaType });
            // var objectUrl = URL.createObjectURL(blob);
            // window.open(objectUrl)
            // window['saveAs'](blob, row.name);
            // // // console.log(pdfSrc);
            // document
            //     .getElementsByClassName('areaQrCode')[0]
            //     .getElementsByTagName('img')[0]
            //     .src = 'data:image/png;base64,' + JSON.parse(file._body).document;
            var byteCharacters = atob(base64);
            var byteNumbers = new Array(byteCharacters.length);
            for (var i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            var mediaType = 'application/pdf';
            //image/gif, image/png, image/jpeg, image/bmp, image/webp
            if (row.name.toString().toLowerCase().indexOf('.pdf') >= 0)
                mediaType = 'application/pdf';
            if (row.name.toString().toLowerCase().indexOf('.tif') >= 0)
                mediaType = 'image/tiff';
            if (row.name.toString().toLowerCase().indexOf('.jpg') >= 0)
                mediaType = 'image/jpeg';
            if (row.name.toString().toLowerCase().indexOf('.jpeg') >= 0)
                mediaType = 'image/jpeg';
            if (row.name.toString().toLowerCase().indexOf('.png') >= 0)
                mediaType = 'image/png';
            if (row.name.toString().toLowerCase().indexOf('.bmp') >= 0)
                mediaType = 'image/png';
            if (row.name.toString().toLowerCase().indexOf('.gif') >= 0)
                mediaType = 'image/png';
            var blob = new Blob([byteArray], { type: mediaType });
            window['saveAs'](blob, row.name);
        }, error =>{
            let msg = JSON.parse(error._body).message;
            really.dialog(msg);
        });

    }
    goCLAP(){
        this.router.navigateByUrl('consultation/clap/' + this.historyConsultation.id + '/history/' + this.historyConsultation.clapId);
    }

}
