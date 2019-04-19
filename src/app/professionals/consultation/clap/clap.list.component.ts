import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PersonService } from '../../../services/person.service';
import { ConsultationService } from '../../../services/consultation.service';
import { OperatorService } from '../../../services/operator.service';

declare const swal: any;
declare const $: any;

@Component({
    selector: 'clap-list-cmp',
    moduleId: module.id,
    templateUrl: 'clap.list.component.1.html'
})

export class ClapListComponent implements OnInit {
    id: number;
    clapId: any;
    searchResult: any = {};
    currentPage: number = 0;
    pageSize: number = 10;
    showSearchInput = false;
    title: string = "Profesionales";
    model: any = {
        examinationValues: {},
        consultationsClap: [],
        jobOfBirths: [],
        postPartums: [],
        newlyBorns: [{ examinationValues: {} }, { examinationValues: {} }]
    };
    listFiltered: any[];
    search: any = '';
    page: number = 0;
    size: number = 20;
    totalPages: number;
    person: any;
    documentNumber: any;
    sex: any;
    createClap: boolean = false;
    consultation: any;
    preRadio: any;
    streetAndNumber: any;
    birthDayDate: any;
    age: any;
    isMinor: any;
    healthCenter: any;
    newlyBorn: any = { examinationValues: {} };
    newlyBornNumber: any = 0;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private clapService: PersonService,
        private consultationService: ConsultationService,
        private operatorService: OperatorService) {
        this.route.params.subscribe(params => {
            this.id = +params.id;
            this.clapId = params.clapId;
        });
        //
        let really = this;
        this.healthCenter = JSON.parse(localStorage.getItem("healthCenterHasOperator")).healthCenter
        // console.log(this.healthCenter);

        let operatorId = JSON.parse(localStorage.getItem('currentUser')).authToken.claims.scopes.id;
        this.consultationService.getConsultation(this.id).subscribe((response: any) => {
            // debugger;
            really.consultation = response;
            really.consultationService.getConsultationClap(response.id).subscribe((responseClap: any) => {
                // console.log('get CLAP', responseClap);
                if (responseClap.clapId && responseClap.clapId != 0)
                    really.model = responseClap;
                // really.newlyBorn = responseClap.newlyBorns[0];

                for (let i = 0; i < 12; i++) {
                    if (!really.model.consultationsClap[i]) {
                        really.model.consultationsClap[i] = {
                            date: '',
                            gestationalAge: '',
                            weight: '',
                            bloodPressure: '',
                            uterineHeight: '',
                            presentation: '',
                            fetalHeartRate: '',
                            fetalMovements: '',
                            proteinuria: '',
                            observations: '',
                            technicalInitials: '',
                            nextConsultation: ''
                        }
                    }
                }
                for (let i = 0; i < 8; i++) {
                    if (!really.model.postPartums[i]) {
                        really.model.postPartums[i] = {
                            time: '',
                            temperature: '',
                            pulse: '',
                            bloodPressure: '',
                            uterineInvolution: '',
                            bleeding: '',
                            responsable: ''
                        }

                    }
                }
                for (let i = 0; i < 5; i++) {
                    if (!really.model.jobOfBirths[i]) {
                        really.model.jobOfBirths[i] = {
                            hour: '',
                            minute: '',
                            motherPosition: '',
                            bloodPressure: '',
                            pulse: '',
                            contractionsTenMinutes: '',
                            dilatation: '',
                            presentationHeight: '',
                            positionVariety: '',
                            meconium: '',
                            fetalHeartRate: ''
                        }
                    }
                }
                for (let i = 0; i < 10; i++) {
                    if (!really.model.newlyBorns[i]) {
                        really.model.newlyBorns[i] = {
                            examinationValues: {}
                        }
                    }
                }
                // console.log('aaaa', really.model);
                let inputs = $(".radio-custom");
                this.buildClap(inputs);
            });


            really.consultation = response;
            really.person = response.schedule.person;
            really.streetAndNumber = really.person.street + ' ' + really.person.addressNumber;
            let birthDayDate = new Date(really.person.birthDayDate);
            really.birthDayDate = birthDayDate.toLocaleString();
            really.age = really.person.age.replace(' años', '');
            if (really.age > 15 && really.age < 35) {
                really.isMinor = 'menor';
            }
            // this.birthDayDate = birthDayDate.getFullYear() + '-0' + birthDayDate.getMonth() + '-0' + birthDayDate.getDay();
            // console.log(really.consultation);
            // console.log(really.person);
        });

        // this.model.consultationsClap.forEach((element: any, index: number) => {
        //     debugger
        //     this.model.consultationsClap[index] = {
        //         date: null,
        //         gestationalAge: null,
        //         weight: null,
        //         bloodPressure: null,
        //         uterineHeight: null,
        //         presentation: null,
        //         fetalHeartRate: null,
        //         fetalMovements: null,
        //         proteinuria: null,
        //         observations: null,
        //         technicalInitials: null,
        //         nextConsultation: null
        //     }
        // });
        // this.getClaps();
        $(".radio-custom-label").click(function () {
            // console.log("click");
        })
        $(".radio-custom").click(function () {
            // console.log("clickr");
        })
    }

    ngOnInit() {
        let reallythis = this;
        // $(".radio-custom-label").click(function(e:any){
        //     // console.log("clicklabel");
        //     // console.log(e);
        //     // console.log("-------");
        // })
        $(".radio-custom").click(function (e: any) {
            // debugger
            // // console.log('target_id',e.target.id);
            // // console.log('target_check',e.target.checked);
            // if(this.preRadio){
            //     // console.log('pre_id',this.preRadio.id);
            //     // console.log('pre_check',this.preRadio.checked);
            // }

            if (reallythis.preRadio && reallythis.preRadio == e.target && reallythis.preRadio.id == e.target.id) {
                reallythis.preRadio.checked = false;
                reallythis.preRadio = null;
            }
            else {
                //debugger
                reallythis.preRadio = e.target;
                e.target.checked = true;
            }
            // // console.log(e);
            // // console.log("clickr");
        })
        document.querySelector('#top').scrollIntoView({ behavior: 'smooth' });
    }
    submit(status: any) {
        let reallythis = this;
        let radios: any[] = [];
        let radiosBorn: any[] = [];
        let inputs = $(".radio-custom");
        this.model.consultationId = this.id;
        Array.prototype.forEach.call(inputs, (element: any) => {
            if (element.checked && element.name.indexOf('10') < 0)
                radios.push(element)
            if (element.checked && element.name.indexOf('10') >= 0)
                radiosBorn.push(element)
        });
        Array.prototype.forEach.call(radios, (element: any) => {
            reallythis.model.examinationValues[element.name] = element.value;
        })
        // let keys = Object.keys(this.model.newlyBorns[this.newlyBornNumber].examinationValues);
        // keys.forEach((key: any) => {
        //     Array.prototype.forEach.call(inputs, (element: any) => {
        //         if (element.checked && element.name == key)
        //             radios.push(element)
        //     });
        // })
        Array.prototype.forEach.call(radiosBorn, (element: any) => {
            reallythis.model.newlyBorns[this.newlyBornNumber].examinationValues[element.name] = element.value;
        })
        // this.model.jobOfBirths = this.model.jobOfBirths.map((element: any) => {
        //     if(element.hour.indexOf(":") < 0){
        //         element.hour += ':' + element.minute;
        //     }
        //     return element;
        // });

        this.model.consultationsClap.map((element: any) => {
            element.bloodPressure = element.bloodPressure.indexOf('/') >= 0 ? element.bloodPressure : element.bloodPressure.indexOf('-') >= 0 ? element.bloodPressure.replace('-', '/') : element.bloodPressure.replace(' ', '/');
            return element;
        });
        // this.model.clapId = null;
        // console.log(this.model);
        // console.log(radios);
        if (this.model.clapId && this.model.clapId != 0) {
            if (status == 'FIN')
                this.model.status = 'PEN'
            else
                this.model.status = 'ACT';
            this.consultationService.putConsultationClap(this.model).subscribe((response: any) => {
                // console.log(response);
                if (response.status == 'PEN')
                    reallythis.router.navigateByUrl('/today/' + reallythis.consultation.schedule.id + '/consultation');
            }, (error) => {
                let body: any = JSON.parse(error._body);
                let msg: string = body && body.message ? body.message : 'Ocurrió un error';
                this.dialog(msg);
            })
        }
        else {
            this.model.clapId = 0;
            this.model.placeOfBirth = this.model.placeOfBirth ? this.model.placeOfBirth : '';
            if (status == 'FIN')
                this.model.status = 'PEN'
            else
                this.model.status = 'ACT';
            this.consultationService.postConsultationClap(this.model).subscribe((response: any) => {
                // console.log(response);
                if (response.status == 'PEN')
                    reallythis.router.navigateByUrl('/today/' + reallythis.consultation.schedule.id + '/consultation');
            }, (error) => {
                let body: any = JSON.parse(error._body);
                let msg: string = body && body.message ? body.message : 'Ocurrió un error';
                this.dialog(msg);
            })

        }
    }
    private dialog(msg: string) {
        swal({
            title: msg,
            animation: false,
            customClass: 'animated tada',
            confirmButtonColor: '#f44336'
        });
    }
    submitFinalizar() {
        let really = this;
        swal({
            title: '¿Desea dar por finalizado el CLAP?',
            text: 'No se podrá volver a editar y pasará al historico una vez firmada la consulta',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f44336',
            //cancelButtonColor: '#d33',
            confirmButtonText: 'Finalizar',
            cancelButtonText: 'Cancelar'
        }).then(function () {
            really.submit('FIN')
        });
    }
    buildClap(inputs: any) {
        let really = this;
        let keys = Object.keys(this.model.examinationValues);
        keys.forEach((key: any) => {
            // // console.log(key);
            Array.prototype.forEach.call(inputs, (element: any) => {
                if (element.name == key && element.value == really.model.examinationValues[key]) {
                    // // console.log(element.name, element.value);
                    element.checked = true;
                }
            });
        });
        keys = Object.keys(this.model.newlyBorns[this.newlyBornNumber].examinationValues);
        keys.forEach((key: any) => {
            Array.prototype.forEach.call(inputs, (element: any) => {
                if (element.name == key && element.value == really.model.newlyBorns[this.newlyBornNumber].examinationValues[key]) {
                    element.checked = true;
                }
                else if (element.name == key) {
                    element.checked = false;
                }
            })
        })
    }
    checkFetalMovements(ev: any, position: any) {
        console.log(ev);
        let targ = ev.target;
        // debugger
        if (ev.target.value !== "-" && ev.target.value !== "+") {
            // this.model.consultationsClap[position].fetalMovements = '';
            targ.value = '';
        }
    }
    changeNewlyBorns(ev: any) {
        let really = this;
        // console.log(ev.value);
        // let index = ev.value - 1;
        // this.newlyBorn = this.model.newlyBorns[index];
        let inputs = $(".radio-custom");
        let radios: any[] = [];
        // let keys = Object.keys(this.model.newlyBorns[this.newlyBornNumber].examinationValues);
        // keys.forEach((key: any) => {
        Array.prototype.forEach.call(inputs, (element: any) => {
            if (element.checked && element.name.indexOf('10') >= 0)
                radios.push(element)
        });
        // })
        Array.prototype.forEach.call(radios, (element: any) => {
            really.model.newlyBorns[this.newlyBornNumber].examinationValues[element.name] = element.value;
        })
        this.newlyBornNumber = ev.value;
        this.buildClap(inputs);
    }
    cancelSubmit() {
        let really = this;
        swal({
            title: '¿Está seguro de Volver?',
            text: 'Recuerde Guardar Cambios',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f44336',
            //cancelButtonColor: '#d33',
            confirmButtonText: 'Volver',
            cancelButtonText: 'Cancelar'
        }).then(function () {
            really.router.navigateByUrl('/today/' + really.consultation.schedule.id + '/consultation')
            // window.history.back();            
        });
    }
    backPage() {
        let really = this;
        swal({
            title: '¿Está seguro de Volver?',
            text: 'Recuerde Guardar Cambios',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f44336',
            //cancelButtonColor: '#d33',
            confirmButtonText: 'Volver',
            cancelButtonText: 'Cancelar'
        }).then(function () {
            window.history.back();            
        });
    }

}
