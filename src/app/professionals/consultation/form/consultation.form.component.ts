import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, LOCALE_ID, Renderer } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';


import { AppSettings } from '../../../app.settings';

import { ConsultationService } from '../../../services/consultation.service';
import { PersonService } from '../../../services/person.service';
import { SpecialityService } from '../../../services/speciality.service';
import { ScheduleService } from '../../../services/schedule.service';
import { VademecumService } from '../../../services/vademecum.service';
import { ExaminationService } from '../../../services/examination.service';
import { resetFakeAsyncZone } from '@angular/core/testing';
import { Response } from '@angular/http/src/static_response';
import { audit } from 'rxjs/operator/audit';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { debug } from 'util';

declare const swal: any;
declare const $: any;

@Component({
    selector: 'consultation-form-cmp',
    moduleId: module.id,
    templateUrl: 'consultation.form.component.html',
    styleUrls: ['./consultation.form.style.scss']
})

export class ConsultationFormComponent implements OnInit {
    title: string = "Nueva Consulta";
    healthCenter: any;
    model: any = {};
    id: number;
    scheduleId: number;
    schedule: any;
    person: any = {};
    documentNumber: string;
    sex: string;
    sistolica: any = 0;
    diastolica: any = 0;
    specialities: any[];
    currentSpecialities: any[];
    examinationValues: any[] = [];
    examinationType: any;
    examinationResult: any;
    examinationStudies: any[] = [];
    examinationItems: any[] = [];
    auxExaminationItems: any[] = [];
    examinationCtrl: FormControl;
    filteredExaminations: Observable<any[]>;
    examinations: any;
    auxExaminationStudies: any[] = [];
    indexExam: any = null;
    indexPres: any = null;
    vademecumValues: any;
    vademecumCtrl: FormControl;
    filteredVademecum: Observable<any[]>;
    prescriptions: any[] = [];
    amount: any;
    vademecums: any;
    auxVademecums: any;
    prescription: any = {};
    vademecum: any;
    diagnosisCtrl: FormControl;
    filteredDiagnosis: Observable<any[]>;
    diagnosis: any = { diagnosisType: "PRE" };
    diagnosisValues: any;
    diagnosises: any[] = [];
    indexDiag: any = null;
    indexCom: any = null;
    diagnosisNomen: any;
    auxDiagnosis: any;
    auxComplementary: any;
    complementaryStudies: any[];
    complementary: any = {};
    complementaries: any[] = [];
    complementaryCtrl: FormControl;
    filteredComplementary: Observable<any[]>;
    vademecumOdontogram: any[];
    auxvademecumOdontogram: any[];
    filteredOdontogram: Observable<any[]>;
    odontogramCtrl: FormControl;
    filteredTratamientosGral: Observable<any[]>;
    ophthalCtrl: FormControl;
    filteredOphthalmology: Observable<any[]>;
    tratGralCtrl: FormControl;
    vademecumTratamientosGral: any[];
    auxvademecumTratamientosGral: any[];
    tratGral: any;
    auxvademecumOphthalmology: any[];
    ophthalmologyVademecums: any[] = [];
    ophthalmologyVademecum: any;
    // vademecumOdontogramValue: any;
    comstudies: any;
    monthsAge: any;
    socialSecurity: any;
    summaryPerson: any[] = [];
    historyConsultation: any;
    adultoArriba: any;
    adultoAbajo: any;
    ninoArriba: any;
    ninoAbajo: any;
    caraDiente: any;
    caraDienteVal: any;
    posicionDiente: any;
    posicionDienteVal: any;
    prePosicionDiente: any;
    preCaraDiente: any;
    fulljson: any;
    files: any;
    filesToPost: any;
    currentUser: any;
    practica: any; //Odontograma
    practicas: any[] = []; //Odontograma
    status: any = 'PEN';
    practicas_ant: any[] = [];
    historyPercentil: any;
    percentileIsWeek: any = "0";
    isDentist: boolean = false;
    attachmentFiles: any[] = [];
    filedownload: any;
    filename: any;
    tejidoCaraVal: any;
    tejidoDescripcion: any;
    tejidosBlandos: any[] = [];
    tratamientoCaraVal: any;
    tratamientoDescripcion: any;
    tratamientosGral: any[] = [];
    specialtyModules: any[] = [];
    vaccinePersonGroup: any[] = [];
    personHasVaccine: any[] = [];
    personVaccine: any = {};
    currentCheckbox: any;
    historyVaccines: any;
    examinationOphthalmologyDto: any[] = [];
    opthalmologyItems: any[] = ["AV_OD1", "AV_OD2", "AV_OI1", "AV_OI2", "AV_VC", "AV_FE", "AV_OB", "BI_ODM", "BI_ODH", "BI_OIM", "BI_OIH", "BI_TO", "BI_TY", "MO_HI", "MO_CO", "MO_MO", "MO_CV", "BI_ODO", "BI_OIO"]
    stomatologyArray: any[] = [];
    ophthalmologicExaminations: any = {};
    posologia: any;
    posoMedidas: any[] = [];
    // signs vital
    heartRate: FormControl;
    sistolic: FormControl;
    diastolic: FormControl;
    breathingFrecuency: FormControl;
    temperature: FormControl;
    height: FormControl;
    weight: FormControl;

    @ViewChild('navTrigger') navTrigger: ElementRef;

    constructor(
        private domSanitizer: DomSanitizer,
        private route: ActivatedRoute,
        private router: Router,
        private consultationService: ConsultationService,
        private personService: PersonService,
        private scheduleService: ScheduleService,
        private specialityService: SpecialityService,
        private vademecumService: VademecumService,
        private examinationService: ExaminationService,
        private cdr: ChangeDetectorRef,
        private renderer: Renderer,
    ) {
        let reallythis = this;
        //Obtener Usuario PEN
        this.currentUser = localStorage.getItem('currentUser');
        this.healthCenter = JSON.parse(localStorage.getItem('healthCenterHasOperator')).healthCenter;
        // Cargar estudios predefinidos
        this.examinationStudies = [{ type: "Examen cardíaco y vascular" },
        { type: "Examen del aparato digestivo" },
        { type: "Examen del aparato urinario" },
        { type: "Examen del sistema linfático" },
        { type: "Examen dermatológico" },
        { type: "Examen ginecológico" },
        { type: "Examen neurológico" },
        { type: "Examen osteoarticular" },
        { type: "Examen otorrinolaringológico" },
        { type: "Examen pulmonar o respiratorio" },
        { type: "Examen psiquiátrico y psicológico" },
        { type: "Examen odontológico" }]
        //Cargar validaciones signos
        this.heartRate = new FormControl("", [Validators.max(999)]);
        this.sistolic = new FormControl("", [Validators.max(999)]);
        this.diastolic = new FormControl("", [Validators.max(999)]);
        this.breathingFrecuency = new FormControl("", [Validators.max(999)]);
        this.temperature = new FormControl("", [Validators.max(999)]);
        this.height = new FormControl("", [Validators.max(999)]);
        this.weight = new FormControl("", [Validators.max(999)]);

        //
        //CARGAR DATOS DE OFTALMOLOGIA
        // debugger
        this.opthalmologyItems.forEach((element) => {
            let obj: any = {};
            obj.itemCode = element;
            obj.examValue = '';
            this.examinationOphthalmologyDto.push(obj);
        })
        // Verificar si vienen los parametros necesarios
        this.route.params.subscribe(params => {
            this.id = +params.id;
            this.scheduleId = +params.scheduleId;
        });
        this.diagnosisCtrl = new FormControl();
        this.complementaryCtrl = new FormControl();
        this.examinationCtrl = new FormControl();
        this.vademecumCtrl = new FormControl();
        this.odontogramCtrl = new FormControl();
        this.tratGralCtrl = new FormControl();
        this.ophthalCtrl = new FormControl();
        ////////////////// VERIFICAR MAS
        this._armarOdontograma();
        if (this.id) {
            this.title = "Finalizar Consulta";
            consultationService.getConsultation(this.id).subscribe((response: any) => {
                // debugger
                //// console.log('respuestacons', response);
                this.model = response;
                this.model.document.forEach((element: any) => {
                    if (element.code == 'ADJ') {
                        this.attachmentFiles.push(element);
                    }
                });
                this.diagnosises = response.diagnosis;
                // this.prescriptions = response.prescriptions;
                this.model.prescriptions.forEach((element: any) => {
                    if (element.vademecum.benefitType == 'P') {
                        this.complementaries.push(element);
                    }
                    else if (element.vademecum.benefitType == 'M') {
                        this.prescriptions.push(element);
                    }
                });
                this.examinationValues = response.examinationValues;
                this.person = this.model.schedule.person;
                if (response.examinationOphthalmologyDto.length > 0) {
                    this.examinationOphthalmologyDto = response.examinationOphthalmologyDto;
                }

                if (reallythis.model.ophthalmologicPrescription.examinationValues && reallythis.model.ophthalmologicPrescription.examinationValues.length > 0) {
                    reallythis.model.ophthalmologicPrescription.examinationValues.forEach((element: any) => {
                        reallythis.ophthalmologicExaminations[element.itemCode] = element.examValue;
                    });
                }
                // Separar sistolica y diastolica de bloodPreassure
                reallythis.sistolica = reallythis.model.bloodPreassure.toString().substring(0, reallythis.model.bloodPreassure.indexOf('/'));
                reallythis.diastolica = reallythis.model.bloodPreassure.toString().substring(reallythis.model.bloodPreassure.indexOf('/') + 1);
                // this.model.ophthalmologicPrescription = {};
                //// console.log(this.person);
                this.personService.getByDocumentAndSex(this.person.docNumber, this.person.sex).subscribe((response: any) => {
                    //// console.log(response);
                    this.consultationService.getOdontogram(response.id).subscribe((response: any) => {
                        // this.status = "ACT";
                        //// console.log('ODONTOGRAMA**********', response);
                        this.buildOdontogram(response);
                    });
                    this.consultationService.getTratamientosGenerales(response.id).subscribe((response: any) => {
                        //// console.log('GENERALES**********', response);
                        this.tratamientosGral = response;
                    });
                    this.socialSecurity = response.socialSecurity == null ? { vademecumType: null } : response.socialSecurity;
                    this.socialSecurity.vademecumType = this.socialSecurity.vademecumType == null || !this.socialSecurity.vademecumType ? { id: 2 } : response.socialSecurity.vademecumType;
                    this.autocompleteAsync();

                    // //// console.log(this.socialSecurity.vademecumType.id);
                })
                this.getPercentil();
                // this.model.examinationValues = this.examinationValues;
                this.monthsAge = this.calculateMonthAge(this.person.birthDayDate);

            });
        }
        else if (this.scheduleId) {
            //buscar schedule paciente
            scheduleService.getSchedule(this.scheduleId).subscribe((response: any) => {
                //// console.log('schedule', response);
                // debugger
                reallythis.schedule = response;
                reallythis.person = response.person;

                this.personService.getByDocumentAndSex(this.person.docNumber, this.person.sex).subscribe((response: any) => {
                    this.socialSecurity = response.socialSecurity == null ? { vademecumType: null } : response.socialSecurity;
                    this.socialSecurity.vademecumType = this.socialSecurity.vademecumType == null || !this.socialSecurity.vademecumType ? { id: 2 } : response.socialSecurity.vademecumType;
                    this.getPercentil();
                    // reallythis.monthsAge =  Date.now() - response.person.birthDay;
                    this.monthsAge = this.calculateMonthAge(this.person.birthDayDate);
                    this.consultationService.postConsultation(reallythis.scheduleId, response).subscribe((response: any) => {
                        reallythis.id = response.id;
                        reallythis.model = response;
                        if (!reallythis.model.ophthalmologicPrescription)
                            reallythis.model.ophthalmologicPrescription = {};
                        if (response.examinationOphthalmologyDto.length > 0) {
                            this.examinationOphthalmologyDto = response.examinationOphthalmologyDto;
                        }
                        if (reallythis.model.ophthalmologicPrescription.examinationValues && reallythis.model.ophthalmologicPrescription.examinationValues.length > 0) {
                            reallythis.model.ophthalmologicPrescription.examinationValues.forEach((element: any) => {
                                reallythis.ophthalmologicExaminations[element.itemCode] = element.examValue;
                            });
                        }
                        // Separar sistolica y diastolica de bloodPreassure
                        reallythis.sistolica = reallythis.model.bloodPressure.substring(0, reallythis.model.bloodPressure.indexOf('/'));
                        reallythis.diastolica = reallythis.model.bloodPressure.substring(reallythis.model.bloodPressure.indexOf('/') + 1);
                        // reallythis.attachmentFiles = this.model.document;
                        this.model.document.forEach((element: any) => {
                            if (element.code == 'ADJ') {
                                this.attachmentFiles.push(element);
                            }
                        });
                        this.diagnosises = this.model.diagnosis;
                        // this.prescriptions = this.model.prescriptions;
                        this.model.prescriptions.forEach((element: any) => {
                            if (element.vademecum.benefitType == 'P') {
                                this.complementaries.push(element);
                            }
                            else if (element.vademecum.benefitType == 'M') {
                                this.prescriptions.push(element);
                            }
                        });
                        this.examinationValues = this.model.examinationValues;
                        this.consultationService.specialtyModules(this.schedule.id).subscribe((response: any) => {
                            //// console.log(response);
                            this.specialtyModules = response;
                            if (this.isSpecialtyModules('ODONTOGRAM')) {
                                this.consultationService.getOdontogram(reallythis.person.id).subscribe((response: any) => {
                                    this.status = "ACT";
                                    //// console.log('ODONTOGRAMA**********', response);
                                    this.consultationService.getExaminationStomatology().subscribe((stomatology: any) => {
                                        reallythis.stomatologyArray = stomatology;
                                    })
                                    this.buildOdontogram(response);
                                });
                                this.consultationService.getTratamientosGenerales(reallythis.person.id).subscribe((response: any) => {
                                    //// console.log('GENERALES**********', response);
                                    this.tratamientosGral = response;
                                });
                            }
                            if (this.isSpecialtyModules('VACCINES')) {
                                this.getvaccinePersonGroup();
                            }
                        });
                        // reallythis.model.examinationValues = reallythis.examinationValues;
                        // METODOS AUTOCOMPLETAR
                        this.autocompleteAsync();
                        //// console.log(response);
                    }, (error: any) => {
                        this.dialog("Usted No Posee Permisos para la Accion Requerida");
                        this.router.navigateByUrl('/today');
                    });
                })
            });
        }
    }
    ctrlKeyDown(event: any) {
        console.log(event);
        return (event.ctrlKey || event.altKey
            || (47 < event.keyCode && event.keyCode < 58 && event.shiftKey == false)
            || (95 < event.keyCode && event.keyCode < 106)
            || (event.keyCode == 8) || (event.keyCode == 9)
            || (event.keyCode > 34 && event.keyCode < 40)
            || (event.keyCode == 46)
            || ((event.keyCode == 188) && event.target.value.indexOf(',') == -1)
            || ((event.target.value.indexOf(',') > 1) && (event.target.value.toString().substring(event.target.value.indexOf(',')).length < 2)))
    }
    ctrlLength(ev: any, cmp: any) {
        console.log(ev.target.value.toString());
        if (ev.target.value.toString() == '.' || ev.target.value > cmp || ev.target.value.toString().length > cmp.toString().length) {
            ev.target.value = ev.target.value.substring(0, ev.target.value.length - 1);
        }
    }

    showBtnFinalizar() {
        if (
            //this.isSpecialtyModules('SYMPTOM')
            //&&
            this.isSpecialtyModules('REASON')
            // && this.isSpecialtyModules('DIAGNOSIS')
            // && this.model.symptom
            && this.model.reason
            // && this.diagnosises.length
            // && this.diagnosises.length > 0
        )
            return false;
        // else if (this.isSpecialtyModules('SYMPTOM')
        //     // && this.isSpecialtyModules('REASON')
        //     && this.model.symptom
        //     // && this.model.reason
        //     // && !this.isSpecialtyModules('DIAGNOSIS')
        // )
        //     return false;
        // else if (!this.isSpecialtyModules('SYMPTOM')
        //     && this.isSpecialtyModules('REASON')
        //     // && this.isSpecialtyModules('DIAGNOSIS')
        //     && this.model.reason
        //     // && this.diagnosises.length
        //     // && this.diagnosises.length > 0
        // )
        //     return false;
        // else if (!this.isSpecialtyModules('SYMPTOM')
        //     && !this.isSpecialtyModules('REASON')
        //     // && this.isSpecialtyModules('DIAGNOSIS')
        //     // && this.diagnosises.length
        //     // && this.diagnosises.length > 0
        // )
        //     return false;
        // else if (!this.isSpecialtyModules('SYMPTOM')
        //     && !this.isSpecialtyModules('REASON')
        //     // && !this.isSpecialtyModules('DIAGNOSIS')
        // )
        // return false
        else
            return true;
    }

    calculateMonthAge(date: any) {
        let birth = new Date(date);
        let now = new Date();
        let month_now = now.getMonth() + 1;
        let month_birth = birth.getMonth() + 1;
        let diff_ms = Date.now() - +birth;
        let age_dt = new Date(diff_ms);
        let age = Math.abs(age_dt.getUTCFullYear() - 1970);
        let mm = Math.abs(age_dt.getMonth());
        // let months = 
        return (age * 12) + mm;
    }

    async autocompleteAsync() {
        // this.cdr.detectChanges();
        // Datos autocomplete Examenes
        if (this.model.schedule.service) {
            this.examinationService.getExaminationsItemByService(this.model.schedule.service.id).subscribe((response: any) => {
                this.examinationItems = response;
                this.filteredExaminations = this.examinationCtrl.valueChanges
                    .startWith(null)
                    .map(exam => exam ? this.filterExamination(exam) : this.examinationItems.slice());
            });
        }
        //
        // Datos autocomplete Vademecum
        this.vademecumService.getVademecums('', 'M', this.socialSecurity.vademecumType.id).subscribe((response: any) => {
            //// console.log(response);
            this.vademecumValues = response.content;
            this.auxVademecums = response.content;
            //
            this.filteredVademecum = this.vademecumCtrl.valueChanges
                .startWith(null)
                .map((vademecum: any) => {
                    if (vademecum && typeof vademecum !== 'object') {
                        this.vademecumService.getVademecums(vademecum, 'M', this.socialSecurity.vademecumType.id).map(response => response).subscribe((response: any) => {
                            //// console.log('responde', response);
                            // //// console.log(this.filterService(service).then((response)=>{return response})); return service ? this.filterService(service).then((response)=>{return response}) : this.services.slice()
                            this.auxVademecums = response.content;
                        });
                        return this.auxVademecums.filter((vad: any) =>
                            vad.activePrinciple.toString().toUpperCase().indexOf(vademecum.toString().toUpperCase()) >= 0
                        );
                    }
                    else {
                        return this.vademecumValues.slice();
                    }
                });

            this.vademecumService.getPosologia().subscribe((response: any) => {
                this.posoMedidas = response;
            })

        });
        // Datos autocomplete Estudios Complementar
        this.vademecumService.getVademecums('', 'P', this.socialSecurity.vademecumType.id).subscribe((response: any) => {
            //// console.log(response);
            this.complementaryStudies = [];
            this.complementaryStudies = response.content;
            this.auxComplementary = [];
            this.auxComplementary = response.content;
            //
            this.filteredComplementary = this.complementaryCtrl.valueChanges
                .startWith(null)
                .map((vademecum: any) => {
                    if (vademecum && typeof vademecum !== 'object') {
                        this.vademecumService.getVademecums(vademecum, 'P', this.socialSecurity.vademecumType.id).map(response => response).subscribe((response: any) => {
                            //// console.log('responde', response);
                            this.auxComplementary = [];
                            // //// console.log(this.filterService(service).then((response)=>{return response})); return service ? this.filterService(service).then((response)=>{return response}) : this.services.slice()
                            this.auxComplementary = response.content;
                        });
                        return this.auxComplementary.filter((vad: any) =>
                            vad.activePrinciple.toString().toUpperCase().indexOf(vademecum.toString().toUpperCase()) >= 0
                        );
                    }
                    else {
                        return this.complementaryStudies.slice();
                    }
                });
        });
        // Datos autocomplete Estudios Complementar
        this.vademecumService.getVademecums('', 'P', 3).subscribe((response: any) => {
            //// console.log(response);
            this.vademecumOdontogram = response.content;
            this.auxvademecumOdontogram = response.content;
            //
            this.filteredOdontogram = this.odontogramCtrl.valueChanges
                .startWith(null)
                .map((vademecum: any) => {
                    if (vademecum && typeof vademecum !== 'object') {
                        this.vademecumService.getVademecums(vademecum, 'P', 3).map(response => response).subscribe((response: any) => {
                            //// console.log('responde', response);
                            // //// console.log(this.filterService(service).then((response)=>{return response})); return service ? this.filterService(service).then((response)=>{return response}) : this.services.slice()
                            this.auxvademecumOdontogram = response.content;
                        });
                        return this.auxvademecumOdontogram.filter((vad: any) =>
                            vad.activePrinciple.toString().toUpperCase().indexOf(vademecum.toString().toUpperCase()) >= 0
                        );
                    }
                    else {
                        return this.vademecumOdontogram.slice();
                    }
                });
        });
        this.vademecumService.getVademecums('', 'P', 5).subscribe((response: any) => {
            //// console.log(response);
            this.vademecumTratamientosGral = response.content;
            this.auxvademecumTratamientosGral = response.content;
            //
            this.filteredTratamientosGral = this.tratGralCtrl.valueChanges
                .startWith(null)
                .map((vademecum: any) => {
                    if (vademecum && typeof vademecum !== 'object') {
                        this.vademecumService.getVademecums(vademecum, 'P', 5).map(response => response).subscribe((response: any) => {
                            //// console.log('responde', response);
                            // //// console.log(this.filterService(service).then((response)=>{return response})); return service ? this.filterService(service).then((response)=>{return response}) : this.services.slice()
                            this.auxvademecumTratamientosGral = response.content;
                        });
                        return this.auxvademecumTratamientosGral.filter((vad: any) =>
                            vad.activePrinciple.toString().toUpperCase().indexOf(vademecum.toString().toUpperCase()) >= 0
                        );
                    }
                    else {
                        return this.vademecumTratamientosGral.slice();
                    }
                });
        });
        this.vademecumService.getVademecums('', 'OP', 4).subscribe((response: any) => {
            //// console.log(response);
            this.ophthalmologyVademecums = response.content;
            this.auxvademecumOphthalmology = response.content;
            //
            this.filteredOphthalmology = this.ophthalCtrl.valueChanges
                .startWith(null)
                .map((vademecum: any) => {
                    if (vademecum && typeof vademecum !== 'object') {
                        this.vademecumService.getVademecums(vademecum, 'OP', 4).map(response => response).subscribe((response: any) => {
                            //// console.log('responde', response);
                            // //// console.log(this.filterService(service).then((response)=>{return response})); return service ? this.filterService(service).then((response)=>{return response}) : this.services.slice()
                            this.auxvademecumOphthalmology = response.content;
                        });
                        return this.auxvademecumOphthalmology.filter((vad: any) =>
                            vad.activePrinciple.toString().toUpperCase().indexOf(vademecum.toString().toUpperCase()) >= 0
                        );
                    }
                    else {
                        return this.ophthalmologyVademecums.slice();
                    }
                });
        });
        // Datos autocomplete Diagnosis
        this.consultationService.getDiagnosis('A').subscribe((response: any) => {
            //// console.log(response);
            this.diagnosisValues = response.content;
            this.auxDiagnosis = response.content;
            //
            this.filteredDiagnosis = this.diagnosisCtrl.valueChanges
                .startWith(null)
                .map(diag => {
                    if (diag && typeof diag !== 'object') {
                        let data = this.consultationService.getDiagnosis(diag).map(response => response).subscribe((response: any) => {
                            //// console.log('responde', response);
                            this.auxDiagnosis = response.content;
                        });
                        return this.auxDiagnosis.filter((vad: any) =>
                            vad.description.toString().toUpperCase().indexOf(diag.toString().toUpperCase()) >= 0
                        );
                    }
                    else {
                        return this.diagnosisValues.slice();
                    }
                });
        });
    }
    calculateIMC() {
        let height = this.model.height.replace(',', '.');
        let weight = this.model.weight.replace(',', '.');
        this.model.bodyMass = (weight / (height * height)) * 10000;
        this.model.bodyMass = this.model.bodyMass.toFixed(1);
    }
    filterExamination(exam: any) {
        return this.examinationItems.filter((filter: any) =>
            filter.name.toString().toUpperCase().indexOf(exam.toString().toUpperCase()) >= 0);
    }
    filterDiagnosis(exam: any) {
        return this.diagnosisValues.filter((filter: any) => {
            return filter.description.toString().toUpperCase().indexOf(exam.toString().toUpperCase()) >= 0;
        });
    }
    ngOnInit() {
        document.querySelector('#top').scrollIntoView({ behavior: 'smooth' });
    }

    isDentistSpecialty(id: any) {
        //Esperando definiciones
        return this.specialityService.specialtyType(id, 'ODONTOGRAMA');
    }
    addFiles(ev: any) {
        //// console.log(ev);
        if (this.attachmentFiles.length < 3) {
            Array.from(ev.target.files).forEach((element: any) => {
                if (this.attachmentFiles.length < 3
                    && element.size < 10000000 && (element.type.indexOf("image") >= 0 || element.type.indexOf("pdf") >= 0)) {
                    this.attachmentFiles.push(element);
                }
            });
        }
    }
    deleteFile(row: any, index: any) {
        if (row.id) {
            this.consultationService.deleteAttachment(this.id, row.id).subscribe(response => {
                this.dialog('Eliminado con Éxito!')
            },
                error => {
                    let body: any = JSON.parse(error._body);
                    let msg: string = body && body.message ? body.message : 'Ocurrió un error al intentar eliminar Archivo';
                    this.dialog(msg);
                })
        }
        this.attachmentFiles.splice(index, 1);
    }

    uploadFiles() {
        let really = this;
        this.attachmentFiles.forEach((element: any, index: any) => {
            if (!element.id) {
                really.uploadFile(element, index);
            }
        })
    }
    downloadAttachment(row: any) {
        // this.consultationService.downloadAttachment(row.pathName).subscribe((response: any) => {
        //     //// console.log(response.headers._headers);
        //     //// console.log(response);
        //     //// console.log(Array.from(response.headers._headers)[1][1][0]);
        //     var mediaType = Array.from(response.headers._headers)[1][1][0].toString();
        //     // mediaType = mediaType.substring(0, mediaType.indexOf(';'));
        //     var blob = new Blob([(<any>response)._body], { type: mediaType });
        //     //// console.log(blob);
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
        if (row.id) {
            this.consultationService.downloadAttachment(row.pathName).subscribe((file: any) => {
                //// console.log(file);
                let base64 = JSON.parse(file._body).document;
                // //// console.log(file);
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
                // // //// console.log(pdfSrc);
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
            });
        }

    }
    uploadFile(file: any, index: any) {
        let really = this;
        let formData: FormData = new FormData();
        //// console.log('FILE', file);
        //formData.append('document', JSON.stringify(document));
        formData.append('file', file, file.name);
        formData.append('originalName', file.name);
        formData.append('consultationId', this.id.toString());
        formData.append('mimeType', file.type);
        formData.append('fileCode', 'ADJ');
        formData.append('observation', file.observation);
        //// console.log(formData);

        ////// console.log('formData:' + formData);
        this.consultationService.uploadFiles(formData).subscribe((response: any) => {
            really.attachmentFiles[index] = response;
            really.dialog('Documento Subido con Éxito')
        });
    }
    findPerson() {
        this.personService.getByDocumentAndSex(this.documentNumber, this.sex).subscribe(
            response => {
                this.person = response;
                if (this.person) {
                    this.model.person = this.person;
                    this.model.phone = this.person.phone;
                    this.model.email = this.person.email;
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

    closePerson() {
        this.person = null;
        this.documentNumber = '';
        this.sex = '';
    }

    private findSpeciality(id: number) {
        for (let s of this.specialities) {
            if (s.id == id) {
                return s;
            }
        }
        return null;
    }

    private dialog(msg: string) {
        swal({
            title: msg,
            animation: false,
            customClass: 'animated tada',
            confirmButtonColor: '#f44336'
        });
    }
    private dialogNotTada(title: string, text: string) {
        swal({
            title: title,
            text: text,
            animation: true,
            customClass: 'animated',
            confirmButtonColor: '#f44336'
        });
    }

    onSubmit(goClap: any, guardar?: any, gotoToday?: any) {
        // debugger;
        let really = this;
        let practicas: any[] = [];
        this.model.personHasVaccines = null;
        this.model.bloodPressure = this.sistolica + '/' + this.diastolica;
        this.model.diagnosis = this.diagnosises;
        this.model.schedule = { id: this.model.schedule.id };
        this.model.prescriptions = this.prescriptions;
        this.model.examinationOphthalmologyDto = this.examinationOphthalmologyDto;
        this.model.ophthalmologicPrescription.vademecum = this.model.ophthalmologicPrescription.vademecum ? { id: this.model.ophthalmologicPrescription.vademecum.id } : null;
        if (this.model.ophthalmologicPrescription) {
            let keys: any[] = Object.keys(this.ophthalmologicExaminations)
            really.model.ophthalmologicPrescription.examinationValues = [];
            Array.prototype.forEach.call(keys, (element: any) => {
                let aux: any = {};
                aux.itemCode = element;
                aux.examValue = really.ophthalmologicExaminations[element];
                really.model.ophthalmologicPrescription.examinationValues.push(aux);
            })
        }
        if (this.complementaries) {
            this.complementaries.forEach((c: any) => {
                this.model.prescriptions.push(c);
            })
        }
        if (this.practicas.length > 0 || this.practicas_ant.length > 0 || this.tejidosBlandos.length > 0) {
            practicas = this.practicas_ant.concat(this.practicas);
            practicas = practicas.concat(this.tejidosBlandos);
            practicas = practicas.concat(this.tratamientosGral);
            //// console.log(practicas);
            practicas = practicas.map((element) => {
                let e = element;
                e.cara = '';
                e.pieza = '';
                return e;
            })
            // debugger
        }
        if (!this.id) {
            this.consultationService.postConsultation(this.model, this.schedule).subscribe(response => {
                this.router.navigateByUrl('/today');
            },
                error => {
                    let body: any = JSON.parse(error._body);
                    let msg: string = body && body.message ? body.message : 'Ocurrió un error al intentar crear Consulta';
                    this.dialog(msg);
                });
        }
        else {
            // this.consultationService.endConsultation(this.id, this.model).subscribe(response => {
            //     this.router.navigateByUrl('/today');
            // },
            //     error => {
            //         let body: any = JSON.parse(error._body);
            //         let msg: string = body && body.message ? body.message : 'Ocurrió un error al intentar crear Consulta';
            //         this.dialog(msg);
            //     });
            // debugger

            //Subir archivos
            this.uploadFiles();
            //
            if (practicas.length > 0) {
                this.consultationService.postOdontogram(practicas).subscribe((response: any) => {
                    this.consultationService.endConsultation(this.id, this.model).subscribe((response: any) => {
                        if (!guardar) {
                            this.consultationService.downloadFile(this.id).subscribe((response: any) => {
                                if (response) {
                                    this.model.document[0] = response.document;
                                    this.signAndSend(this.model, JSON.parse(this.currentUser));
                                }
                                else {
                                    this.dialog("VERIFIQUE LOS DATOS A ENVIAR");
                                }
                            }, error => {
                                let msg = JSON.parse(error._body).message;
                                really.dialog(msg);
                            });
                        }
                        if (gotoToday) {
                            really.router.navigateByUrl('today');
                        }
                    }, error => {
                        let msg = JSON.parse(error._body).message;
                        really.dialog(msg);
                    });
                }, error => {
                    let msg = JSON.parse(error._body).message;
                    really.dialog(msg);
                });
            }
            else {
                this.consultationService.endConsultation(this.id, this.model).subscribe((response: any) => {
                    if (!guardar) {
                        this.consultationService.downloadFile(this.id).subscribe((response: any) => {
                            //// console.log(response);
                            this.model.document[0] = response.document;
                            // localStorage.setItem('consulta', JSON.stringify(this.model));
                            if (!goClap)
                                this.signAndSend(this.model, JSON.parse(this.currentUser));
                        }, error => {
                            let msg = JSON.parse(error._body).message;
                            really.dialog(msg);
                        });
                    }
                    if (gotoToday) {
                        really.router.navigateByUrl('today');
                    }
                }, error => {
                    let msg = JSON.parse(error._body).message;
                    really.dialog(msg);
                });
            }
        }
    }
    signAndSend(body: any, currentUser: any) {
        //// console.log('current', currentUser);

        // //// console.log() body.document);
        // //// console.log("signAndSend");    
        // //// console.log(this.filesToPost);
        let file: any[] = [];
        body.document.forEach((element: any) => {
            if (!element.code && element.code != 'ADJ') {
                file.push(element);
            }
        });
        body.document = [];
        this.fulljson = {
            //url: AppSettings.API_ENDPOINT + '/secure/files/upload',
            url: AppSettings.API_ENDPOINT,
            xAuthentication: 'Bearer ' + currentUser.authToken.token,
            procedure: body,
            files: file
        };
        // this.fulljson.files.push(file[0]);
        //// console.log(this.fulljson);
        var fulljsonstring = JSON.stringify(this.fulljson);
        localStorage.setItem('consulta', fulljsonstring);
        // this.router.navigate(['today']);
        this.router.navigate(['/sign']);

    }
    convertToBase64(body: any, currentUser: any) {
        // //// console.log(this.files.length);
        if (this.model.document.length == 0) {
            this.signAndSend(body, currentUser);
        }
        else {
            // //// console.log("convertToBase64");
            let reader: FileReader = new FileReader();
            var cmp = this;
            reader.onloadend = function () {
                // //// console.log("converted file");
                cmp.filesToPost.push({
                    base64: reader.result,
                    mimeType: cmp.files[0].file.type,
                    originalName: cmp.files[0].file.name,
                    id: cmp.files[0].id
                });
                cmp.files = cmp.files.splice(1);
                cmp.convertToBase64(body, currentUser);
            }
            reader.readAsDataURL(this.files[0].file);
        }
    }
    cancelSubmit(open: any) {
        if (!open) {
            $("#modalCancel").modal("show");
        }
        else {
            this.router.navigateByUrl('today');

        }
        //     this.router.navigateByUrl('today');
        // if (this.scheduleId) {
        //     this.consultationService.cancelConsultation(this.id, this.model).subscribe(response => {
        //         //// console.log('cancelado', response);
        //     });
        // }
        // else {
        // }
    }
    cambiaExamen(ev: any) {
        //// console.log(ev);
    }
    getPercentil() {
        this.consultationService.getPercentil(this.person.id).subscribe((response: any) => {
            //// console.log(response);
            this.historyPercentil = response;
        });
    }
    calculatePercentiles() {
        this.percentileIsWeek = this.percentileIsWeek ? this.percentileIsWeek : 0;
        this.consultationService.calculatePercentiles(this.person.id, this.percentileIsWeek, this.model.weight, this.model.height, this.model.brainRadio).subscribe((response: any) => {
            //// console.log(response);
            this.model.percentilBrainRadioXAge = response.percentilBrainRadioXAge;
            this.model.percentilHeightXWeight = response.percentilHeightXWeight;
            this.model.percentilWeightXAge = response.percentilWeightXAge;
        })
    }
    addExamination(exam: any) {
        if (exam.id) {
            //// console.log("object", exam);
            //// console.log("object", this.examinationResult);
            let examination: any = {};
            examination.examinationItem = exam;
            examination.examValue = this.examinationResult;
            // exam.examValue = this.examinationResult;
            let exist = this.examinationValues.findIndex((find: any) => { return find.examinationItem.id == examination.examinationItem.id });
            if (this.indexExam == null && exist < 0) {
                this.examinationValues.push(examination);
            }
            else {
                let aux = this.indexExam == null ? exist : this.indexExam;
                this.examinationValues[aux] = examination;
                this.indexExam = null;
            }
            this.examinationResult = '';
            this.examinations = null;
            // //// console.log(this.examinationValues);
        }
        else {
            this.dialog("Ingrese un Exámen de la lista");
        }
    }
    addPrescription(pres: any) {
        if (pres.id) {
            this.prescription.amount = this.prescription.amount + this.posologia;
            this.prescription.vademecum = this.vademecum;
            this.prescription.refill = this.prescription.refill ? 1 : 0;
            // this.prescription.consultation_id = this.id;
            let exist = this.prescriptions.findIndex((find: any) => {
                //// console.log(find);
                return find.vademecum.id == pres.id;
            });
            if (this.indexPres == null && exist < 0) {
                this.prescriptions.push(this.prescription);
            }
            else {
                let aux = this.indexPres == null ? exist : this.indexPres;
                this.prescription.vademecum = pres;
                this.prescriptions[aux] = this.prescription;
                this.indexPres = null;
            }
            //// console.log(this.prescription);
            this.prescription = { amount: '', frecuency: '', duration: '', vademecum: {} };
            this.posologia = null;
            this.vademecum = null;
        }
        else {
            this.dialog("Ingrese una Prescripción de la lista");
        }

    }
    addComplementary(pres: any) {
        if (pres.id) {
            this.complementary.amount = '';
            this.complementary.frecuency = '';
            this.complementary.duration = '';
            this.complementary.vademecum = this.comstudies;
            // this.complementary.consultation_id = this.id;
            let exist = this.complementaries.findIndex((find: any) => {
                //// console.log(find);
                return find.vademecum.id == pres.id;
            });
            if (this.indexCom == null && exist < 0) {
                this.complementaries.push(this.complementary);
            }
            else {
                let aux = this.indexCom == null ? exist : this.indexCom;
                this.complementary.vademecum = pres;
                this.complementaries[aux] = this.complementary;
                this.indexCom = null;
            }
            //// console.log(this.complementary);
            this.complementary = { amount: '', frecuency: '', duration: '', vademecum: {} };
            this.comstudies = null;
        }
        else {
            this.dialog("Ingrese un Estudio de la lista");
        }
    }
    addDiagnosis(diag: any) {
        if (diag.id) {
            this.diagnosis.description = this.diagnosisNomen.description;
            this.diagnosis.diagnosisNomenclature = this.diagnosisNomen;
            // this.diagnosis.consultation_id = this.id;
            let exist = this.diagnosises.findIndex((find: any) => {
                //// console.log(find);
                //// console.log('viene', diag);
                return find.diagnosisNomenclature.id == diag.id;
            });
            if (this.indexDiag == null && exist < 0) {
                this.diagnosises.push(this.diagnosis);
            }
            else {
                let aux = this.indexPres == null ? exist : this.indexPres;
                // this.diagnosis.vademecum = diag;
                this.diagnosises[aux] = this.diagnosis;
                this.indexDiag = null;
            }
            //// console.log(this.prescription);
            this.diagnosis = { diagnosisType: "PRE" };
            this.diagnosisNomen = null;
        }
        else {
            this.dialog("Ingrese un Diagnostico de la lista");
        }
    }
    displayFn(ex: any) {
        //// console.log(ex);
        return ex ? ex.name : ex;
    }
    displayVade(pres: any) {
        //// console.log(pres);
        return pres && pres != null && pres.activePrinciple ? pres.activePrinciple.replace(/\t/g, '') : pres; //+ ' - ' + pres.potency.replace(/\t/g, '') + ' x' + pres.content.replace(/\t/g, '') + ' - ' + pres.pharmaceuticalForm.replace(/\t/g, '') : pres;
    }
    displayOdontogram(pres: any) {
        //// console.log(pres);
        return pres && pres != null && pres.activePrinciple ? pres.activePrinciple.replace(/\t/g, '') : pres; //+ ' - ' + pres.potency.replace(/\t/g, '') + ' x' + pres.content.replace(/\t/g, '') + ' - ' + pres.pharmaceuticalForm.replace(/\t/g, '') : pres;
    }
    displayTrat(pres: any) {
        //// console.log(pres);
        return pres && pres != null && pres.activePrinciple ? pres.activePrinciple.replace(/\t/g, '') : pres; //+ ' - ' + pres.potency.replace(/\t/g, '') + ' x' + pres.content.replace(/\t/g, '') + ' - ' + pres.pharmaceuticalForm.replace(/\t/g, '') : pres;
    }
    displayOph(pres: any) {
        //// console.log(pres);
        return pres && pres != null && pres.activePrinciple ? pres.activePrinciple.replace(/\t/g, '') : pres; //+ ' - ' + pres.potency.replace(/\t/g, '') + ' x' + pres.content.replace(/\t/g, '') + ' - ' + pres.pharmaceuticalForm.replace(/\t/g, '') : pres;
    }
    displayDiag(diag: any) {
        //// console.log(diag);
        return diag ? diag.description : diag; //+ ' - ' + pres.potency.replace(/\t/g, '') + ' x' + pres.content.replace(/\t/g, '') + ' - ' + pres.pharmaceuticalForm.replace(/\t/g, '') : pres;
    }
    openRow(row: any, i: any) {
        //// console.log(row);
        this.indexExam = null;
        this.examinations = row.examinationItem;
        this.examinationResult = row.examValue;
        this.indexExam = i;
    }
    openRowPrescription(row: any, i: any) {
        //// console.log(row);
        this.prescription = row;
        this.vademecum = row.vademecum;
    }
    openRowDiagnosis(row: any, i: any) {
        //// console.log(row);
        this.diagnosis = row;
        this.diagnosisNomen = row.diagnosisNomenclature;
    }
    openRowComplementary(row: any, i: any) {
        //// console.log(row);
        this.complementary = row;
        this.comstudies = row.vademecum;
    }
    openRowSummary(row: any) {
        this.consultationService.getConsultation(row.consultationId).subscribe((response: any) => {
            //// console.log(response);
            this.historyConsultation = response;
        });
        this.consultationService.getVaccinesByConsultationId(row.consultationId).subscribe((response: any) => {
            this.historyVaccines = response;
        });
        // this.router.navigateByUrl('/consultation/'+ row.consultationId);    
        // location.reload();  
    }
    deleteDiagnosis(row: any, index: any) {
        let reallythis = this;
        swal({
            title: "¿Está seguro de borrar?",
            text: row.diagnosisNomenclature.description,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f44336", confirmButtonText: "Borrar",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
        }).then(function () {
            reallythis.diagnosises.splice(index, 1);
        }, function (dismiss: any) {
        });
        // let arr: any[] = [];
        // this.diagnosises.forEach((r: any) => {
        //     if (!Object.is(row, r)) {
        //         arr.push(r)
        //     }
        // });
        // this.diagnosises = arr;
    }
    deletePrescription(row: any, index: any) {
        let reallythis = this;
        swal({
            title: "¿Está seguro de borrar?",
            text: row.vademecum.activePrinciple,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f44336", confirmButtonText: "Borrar",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
        }).then(function () {
            reallythis.prescriptions.splice(index, 1);
        }, function (dismiss: any) {
        });
        // let arr: any[] = [];
        // this.diagnosises.forEach((r: any) => {
        //     if (!Object.is(row, r)) {
        //         arr.push(r)
        //     }
        // });
        // this.diagnosises = arr;
    }
    deleteComplementary(row: any, index: any) {
        let reallythis = this;
        swal({
            title: "¿Está seguro de borrar?",
            text: row.vademecum.activePrinciple,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f44336", confirmButtonText: "Borrar",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
        }).then(function () {
            reallythis.complementaries.splice(index, 1);
        }, function (dismiss: any) {
        });
        // let arr: any[] = [];
        // this.diagnosises.forEach((r: any) => {
        //     if (!Object.is(row, r)) {
        //         arr.push(r)
        //     }
        // });
        // this.diagnosises = arr;
    }
    deleteExamination(row: any, index: any) {
        let reallythis = this;
        swal({
            title: "¿Está seguro de borrar?",
            text: row.examinationItem.name,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f44336", confirmButtonText: "Borrar",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
        }).then(function () {
            reallythis.examinationValues.splice(index, 1);
        }, function (dismiss: any) {
        });
        // let arr: any[] = [];
        // this.diagnosises.forEach((r: any) => {
        //     if (!Object.is(row, r)) {
        //         arr.push(r)
        //     }
        // });
        // this.diagnosises = arr;
    }
    maskBloodP() {
        let split = this.model.bloodPressure;
        if (split) {
            if (split.length == 3 || split.length == 4) {
                if (split.indexOf('/') < 0)
                    split = split.substring(0, 2) + '/' + split.slice(2);
            }
            else if (split.length >= 5) {
                split = split.replace('/', '')
                if (split.indexOf('/') < 0)
                    split = split.substring(0, 3) + '/' + split.slice(3);
            }
            this.model.bloodPressure = split;
        }
    }
    getSummaryPerson() {
        this.consultationService.getSummaryPerson(this.person.id).subscribe((response: any) => {
            //// console.log(response);
            this.summaryPerson = response;
        })
    }
    _armarOdontograma() {
        var jsonArmado

        var adultoArriba = [];
        let num: number = 18;
        for (var i = 1; i < 17; i++) {
            if (i > 3 && i < 14) {
                jsonArmado = { id: i, tipoDiente: 'decidua mixta', number: num };
                adultoArriba.push(jsonArmado);
            }
            else {
                jsonArmado = { id: i, tipoDiente: 'decidua', number: num };
                adultoArriba.push(jsonArmado);
            }
            if (i < 8)
                num--;
            else if (i == 8)
                num = 21
            else
                num++;

        }
        //// console.log(adultoArriba);
        this.adultoArriba = adultoArriba;

        var adultoAbajo = [];
        num = 48;
        for (var i = 17; i < 33; i++) {
            if (i > 19 && i < 30) {
                jsonArmado = { id: i, tipoDiente: 'decidua mixta', number: num };
                adultoAbajo.push(jsonArmado);
            }
            else {
                jsonArmado = { id: i, tipoDiente: 'decidua', number: num };
                adultoAbajo.push(jsonArmado);
            }
            if (i < 24)
                num--;
            else if (i == 24)
                num = 31
            else
                num++;
        }
        this.adultoAbajo = adultoAbajo;

        var ninoArriba = [];
        num = 55;
        for (var i = 33; i < 43; i++) {
            jsonArmado = { id: i, tipoDiente: 'nino', number: num };
            ninoArriba.push(jsonArmado);
            if (i < 37)
                num--;
            else if (i == 37)
                num = 61
            else
                num++;
        }

        this.ninoArriba = ninoArriba;

        var ninoAbajo = [];
        num = 85
        for (var i = 43; i < 53; i++) {
            jsonArmado = { id: i, tipoDiente: 'nino', number: num };
            ninoAbajo.push(jsonArmado);
            if (i < 47)
                num--;
            else if (i == 47)
                num = 71
            else
                num++;
        }
        this.ninoAbajo = ninoAbajo;
    }
    selectTeeth(ev: any) {
        let dienteSelected = this.status == "PEN" ? 'dienteSelectedBlue' : 'dienteSelectedRed';

        // //// console.log(this);
        if (this.caraDiente) {
            this.clearTeeth(this.caraDiente);
            // this.renderer.setElementClass(this.caraDiente, 'dienteSelectedBlue', false);
            // this.renderer.setElementClass(this.caraDiente, 'dienteSelectedRed', false);
        } if (this.posicionDiente) {
            // //// console.log("entra");
            let aux = this.posicionDiente;
            this.prePosicionDiente = aux;
            aux = this.caraDienteVal;
            this.preCaraDiente = aux;
        }
        // //// console.log(ev);
        // //// console.log(ev.toElement.attributes.value.value);
        let parent = ev.target.parentNode;
        this.caraDiente = ev.target;
        this.caraDienteVal = ev.target.attributes.value.value.toString();
        this.posicionDiente = ev.target.parentNode;
        this.posicionDienteVal = ev.target.parentNode.id.toString();
        // //// console.log(parent.id);
        // //// console.log(parent.querySelectorAll('.corona')[0]);
        // //// console.log("pre",this.prePosicionDiente);
        // //// console.log("pos",this.posicionDiente);
        if (this.preCaraDiente == 'PIEZA_COMPLETA') {
            if (this.prePosicionDiente) {
                let diente = this.prePosicionDiente.getElementsByClassName('diente');
                //// console.log(typeof diente);
                Array.prototype.forEach.call(diente, (element: any) => {
                    this.clearTeeth(element);
                    // this.renderer.setElementClass(element, 'dienteSelectedBlue', false);
                    // this.renderer.setElementClass(element, 'dienteSelectedRed', false);
                });
            }
            else {
                let diente = this.posicionDiente.getElementsByClassName('diente');
                //// console.log(typeof diente);
                Array.prototype.forEach.call(diente, (element: any) => {
                    this.clearTeeth(element);
                    // this.renderer.setElementClass(element, 'dienteSelectedBlue', false);
                    // this.renderer.setElementClass(element, 'dienteSelectedRed', false);
                });
            }
        }
        if (this.caraDienteVal && this.practica && this.practica.code != 'CORONA') {
            this.clearTeeth(ev.target);
            this.renderer.setElementClass(ev.target, dienteSelected, true);
        }
        else if (this.caraDienteVal && this.practica && this.practica.code == 'CORONA') {
            this.caraDienteVal = 'PIEZA_COMPLETA'
            let corona = this.posicionDiente.getElementById('corona');
            this.clearTeeth(corona);
            this.renderer.setElementClass(corona, 'corona', false)
            this.renderer.setElementClass(corona, 'marcadoAzul', true)
            this.renderer.setElementClass(corona, 'marcado', true)
        }
        this.printPracticas();
    }
    selectFace(ev: any) {
        let dienteSelected = this.status == "PEN" ? 'dienteSelectedBlue' : 'dienteSelectedRed';

        // //// console.log(ev);
        // //// console.log(this.caraDienteVal);
        // //// console.log('caraDiente', this.caraDiente);
        // //// console.log(this.caraDienteVal);
        if (this.preCaraDiente == 'PIEZA_COMPLETA') {
            if (this.prePosicionDiente) {
                let diente = this.prePosicionDiente.getElementsByClassName('diente');
                // //// console.log(typeof diente);
                Array.prototype.forEach.call(diente, (element: any) => {
                    this.renderer.setElementClass(element, 'dienteSelectedBlue', false);
                    this.renderer.setElementClass(element, 'dienteSelectedRed', false);
                });
            }
            else {
                let diente = this.posicionDiente.getElementsByClassName('diente');
                // //// console.log(typeof diente);
                Array.prototype.forEach.call(diente, (element: any) => {
                    this.renderer.setElementClass(element, 'dienteSelectedBlue', false);
                    this.renderer.setElementClass(element, 'dienteSelectedRed', false);
                });
            }
        }
        if (this.caraDiente && ev != 'PIEZA_COMPLETA') {
            this.renderer.setElementClass(this.caraDiente, 'dienteSelectedBlue', false);
            this.renderer.setElementClass(this.caraDiente, 'dienteSelectedRed', false);
            let nuevo = this.posicionDiente.getElementById(ev);
            this.caraDiente = nuevo;
            // this.renderer.setElementAttribute(this.caraDiente, "value", this.caraDienteVal);
            this.renderer.setElementClass(this.caraDiente, dienteSelected, true);
        } else if (ev == 'PIEZA_COMPLETA') {
            let diente = this.posicionDiente.getElementsByClassName('diente');
            // //// console.log(typeof diente);
            Array.prototype.forEach.call(diente, (element: any) => {
                this.renderer.setElementClass(element, dienteSelected, true);
            });
            // //// console.log(diente);
        }
        //
        this.caraDienteVal = ev;
        this.printPracticas();
        // // this.caraDiente.value = 3;
        // //// console.log(nuevo);
        // this.caraDiente = nuevo;


        // // this.renderer.setElementAttribute(this.caraDiente, "value", this.caraDienteVal);
        // this.renderer.setElementClass(this.caraDiente, dienteSelected, true);
        // // //// console.log(this.caraDiente);

    }
    selectTejido(ev: any) {
        this.tejidoCaraVal = ev.toString();
        //// console.log(ev);
    }
    selectPractica(ev: any) {
        this.practica = ev;
        //// console.log(ev);
        if (ev) {
            let cara = this.posicionDiente.getElementsByClassName('corona')[0];
            if (this.practica.code == 'CORONA') {
                this.caraDienteVal = 'PIEZA_COMPLETA';
                this.clearTeeth(cara);
                this.renderer.setElementClass(cara, 'marcadoAzul', true)
                this.renderer.setElementClass(cara, 'marcado', true)
                this.renderer.setElementClass(cara, 'corona', false)

            }
            // else
            //     this.clearTeeth(cara)
        }
    }
    addPractica() {
        let obj: any = {};
        obj.pieza_valor = this.posicionDienteVal;
        obj.examinationItemCode = 'PIEZA' + this.posicionDienteVal;
        obj.examinationSubItemCode = this.caraDienteVal;
        obj.examinationSubItemName = this.caraDienteVal.replace('_', ' ');
        // obj.examinationSubItemName = this.caraDienteVal == 0 ? 'Pieza Completa' : null;
        // obj.examinationSubItemName = this.caraDienteVal == 1 && !obj.examinationSubItemName ? 'Palantina' : obj.examinationSubItemName;
        // obj.examinationSubItemName = this.caraDienteVal == 2 && !obj.examinationSubItemName ? 'Mesial' : obj.examinationSubItemName;
        // obj.examinationSubItemName = this.caraDienteVal == 3 && !obj.examinationSubItemName ? 'Vestibular' : obj.examinationSubItemName;
        // obj.examinationSubItemName = this.caraDienteVal == 4 && !obj.examinationSubItemName ? 'Distal' : obj.examinationSubItemName;
        // obj.examinationSubItemName = this.caraDienteVal == 5 && !obj.examinationSubItemName ? 'Oclusal' : obj.examinationSubItemName;
        obj.prescriptionVademecumCode = this.practica.code; //prescripcion
        obj.prescriptionVademecumActivePrinciple = this.practica.activePrinciple;
        obj.consultationId = this.id;
        obj.pieza = this.posicionDiente;
        obj.cara = this.caraDiente;
        obj.status = this.status;
        // obj.status = this.status == 'ACT' && !obj.status ? 'ACT' : obj.status;
        // obj.status = this.status == 'HEC' && !obj.status ? 'HEC' : obj.status;
        // obj.status = this.status == 'PEN' && !obj.status ? 'PEN' : obj.status;
        // Agregar a la lista
        //// console.log(obj);
        // this.renderer.setElementClass(this.caraDiente, 'dienteSelectedBlue', false);
        // this.renderer.setElementClass(this.caraDiente, 'dienteSelectedRed', false);
        if (this.status == 'PEN') {
            // this.renderer.setElementClass(this.caraDiente, 'dienteSelectedBlue', true);
            this.practicas.push(obj);
        }
        else {
            // this.renderer.setElementClass(this.caraDiente, 'dienteSelectedRed', true);
            this.practicas_ant.push(obj);
        }
        this.printPracticas();
        this.preCaraDiente = null;
        this.prePosicionDiente = null;
        this.caraDiente = null;
        this.posicionDiente = null;
        this.caraDienteVal = null;
        this.posicionDienteVal = null;
        this.practica = null;
        //// console.log(this.preCaraDiente);
    }
    addTejido() {
        let tejido: any = {};
        tejido.examinationItemCode = 'LESION_UBICACION'
        tejido.examinationSubItemCode = this.tejidoCaraVal;
        tejido.examinationSubItemName = this.tejidoCaraVal.replace('_', ' ');
        tejido.examValue = this.tejidoDescripcion;
        tejido.status = 'ACT';
        tejido.consultationId = this.id;
        this.tejidosBlandos.push(tejido);
        this.tejidoCaraVal = null;
        this.tejidoDescripcion = null;
    }
    addTratamiento() {
        let tratamiento: any = {};
        tratamiento.examinationItemCode = 'ODONTOLOGY_GENERAL'
        tratamiento.prescriptionVademecumCode = this.tratGral.code; //prescripcion
        tratamiento.prescriptionVademecumActivePrinciple = this.tratGral.activePrinciple;
        tratamiento.examValue = this.tratamientoDescripcion;
        tratamiento.status = 'ACT';
        tratamiento.consultationId = this.id;
        this.tratamientosGral.push(tratamiento);
        this.tratGral = null;
        this.tratamientoCaraVal = null;
        this.tratamientoDescripcion = null;
    }
    printPracticas() {
        //debugger
        let really = this;
        //// console.log(this.practicas);
        let diente = document.getElementsByClassName('diente');
        //// console.log(typeof diente);
        Array.prototype.forEach.call(diente, (element: any) => {
            really.renderer.setElementClass(element, 'dienteSelectedBlue', false);
            really.renderer.setElementClass(element, 'dienteSelectedGreen', false);
            really.renderer.setElementClass(element, 'dienteSelectedRed', false);
        });

        this.practicas_ant.forEach((element: any) => {

            if (element.examinationSubItemCode.toString().toUpperCase() != 'PIEZA_COMPLETA' && element.cara) {
                really.renderer.setElementClass(element.cara, 'dienteSelectedBlue', false);
                really.renderer.setElementClass(element.cara, 'dienteSelectedGreen', false);
                really.renderer.setElementClass(element.cara, 'dienteSelectedRed', true);
            }
            else {
                let diente = element.pieza.getElementsByClassName('diente');
                //// console.log(typeof diente);
                Array.prototype.forEach.call(diente, (element: any) => {
                    really.renderer.setElementClass(element, 'dienteSelectedBlue', false);
                    really.renderer.setElementClass(element, 'dienteSelectedGreen', false);
                    really.renderer.setElementClass(element, 'dienteSelectedRed', true);
                });
            }

        });
        this.practicas.forEach((element: any) => {
            if (element.examinationSubItemCode.toString().toUpperCase() != 'PIEZA_COMPLETA' && element.cara) {
                if (element.status == 'PEN') {
                    really.renderer.setElementClass(element.cara, 'dienteSelectedGreen', false);
                    really.renderer.setElementClass(element.cara, 'dienteSelectedRed', false);
                    really.renderer.setElementClass(element.cara, 'dienteSelectedBlue', true);
                }
                else {
                    really.renderer.setElementClass(element.cara, 'dienteSelectedBlue', false);
                    really.renderer.setElementClass(element.cara, 'dienteSelectedGreen', true);
                    really.renderer.setElementClass(element.cara, 'dienteSelectedRed', false);
                }

            }
            else if (element.status == 'PEN') {
                let diente = element.pieza.getElementsByClassName('diente');
                //// console.log(typeof diente);
                Array.prototype.forEach.call(diente, (element: any) => {
                    really.renderer.setElementClass(element, 'dienteSelectedBlue', true);
                    really.renderer.setElementClass(element, 'dienteSelectedGreen', false);
                    really.renderer.setElementClass(element, 'dienteSelectedRed', false);
                });
            }
            else if (element.status == 'HEC') {
                let diente = element.pieza.getElementsByClassName('diente');
                //// console.log(typeof diente);
                Array.prototype.forEach.call(diente, (element: any) => {
                    really.renderer.setElementClass(element, 'dienteSelectedBlue', false);
                    really.renderer.setElementClass(element, 'dienteSelectedGreen', true);
                    really.renderer.setElementClass(element, 'dienteSelectedRed', false);
                });
            }
        });
    }
    sendFact(row: any, i: number) {
        let aux = row;
        let reallythis = this;
        if (aux.status == 'PEN' && aux.examinationSubItemCode.toString().toUpperCase() != 'PIEZA_COMPLETA' && row.cara) {
            aux.status = 'HEC';
            this.practicas[i] = aux;
            this.renderer.setElementClass(row.cara, 'dienteSelectedBlue', false);
            this.renderer.setElementClass(row.cara, 'dienteSelectedRed', false);
            this.renderer.setElementClass(row.cara, 'dienteSelectedGreen', true);
        }
        else if (aux.examinationSubItemCode.toString().toUpperCase() != 'PIEZA_COMPLETA' && row.cara) {
            aux.status = 'PEN';
            this.practicas[i] = aux;
            this.renderer.setElementClass(row.cara, 'dienteSelectedBlue', false);
            this.renderer.setElementClass(row.cara, 'dienteSelectedGreen', false);
            this.renderer.setElementClass(row.cara, 'dienteSelectedBlue', true);
        }
        else if (aux.status == 'PEN' && aux.examinationSubItemCode.toString().toUpperCase() == 'PIEZA_COMPLETA') {
            aux.status = 'HEC';
            let diente = row.pieza.getElementsByClassName('diente');
            //// console.log(typeof diente);
            Array.prototype.forEach.call(diente, (element: any) => {
                reallythis.renderer.setElementClass(element, 'dienteSelectedBlue', false);
                reallythis.renderer.setElementClass(element, 'dienteSelectedRed', false);
                reallythis.renderer.setElementClass(element, 'dienteSelectedGreen', true);
            });
        }
        else {
            aux.status = 'PEN';
            let diente = row.pieza.getElementsByClassName('diente');
            //// console.log(typeof diente);
            Array.prototype.forEach.call(diente, (element: any) => {
                reallythis.renderer.setElementClass(element, 'dienteSelectedRed', false);
                reallythis.renderer.setElementClass(element, 'dienteSelectedGreen', false);
                reallythis.renderer.setElementClass(element, 'dienteSelectedBlue', true);
            });
        }
    }
    deletePractica(row: any, index: any) {
        let reallythis = this;
        swal({
            title: "¿Está seguro de borrar?",
            text: 'Pieza: ' + row.pieza_valor + ' - Cara: ' + row.examinationSubItemName,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f44336", confirmButtonText: "Borrar",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
        }).then(function () {
            reallythis.practicas.splice(index, 1);
            if (reallythis.practicas.length == 0) {
                reallythis.renderer.setElementClass(row.cara, 'dienteSelectedBlue', false);
                reallythis.renderer.setElementClass(row.cara, 'dienteSelectedGreen', false);
                reallythis.renderer.setElementClass(row.cara, 'dienteSelectedRed', false);
            }

            let diente = row.pieza.getElementsByClassName('diente');
            //// console.log(typeof diente);
            Array.prototype.forEach.call(diente, (element: any) => {
                reallythis.renderer.setElementClass(element, 'dienteSelectedBlue', false);
                reallythis.renderer.setElementClass(element, 'dienteSelectedRed', false);
                reallythis.renderer.setElementClass(element, 'dienteSelectedGreen', false);
            });
            reallythis.printPracticas();
        }, function (dismiss: any) {
        });
    }
    deleteTejidos(row: any, index: any) {
        let reallythis = this;

        swal({
            title: "¿Está seguro de borrar?",
            text: 'Tejido: ' + row.examinationSubItemName,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f44336", confirmButtonText: "Borrar",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
        }).then(function () {
            // debugger
            if (reallythis.tejidosBlandos[index].examinationValueId) {
                reallythis.tejidosBlandos[index].status = 'BAJ';
            }
            else {
                reallythis.tejidosBlandos.splice(index, 1);
            }
            // reallythis.tejidosBlandos[index].status = 'BAJ';
            // reallythis.tejidosBlandos.splice(index, 1);
        }, function (dismiss: any) {
        });
    }
    deleteTratamiento(row: any, index: any) {
        let reallythis = this;

        swal({
            title: "¿Está seguro de borrar?",
            text: 'Tratamiento: ' + row.prescriptionVademecumActivePrinciple,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f44336", confirmButtonText: "Borrar",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
        }).then(function () {
            // debugger
            if (reallythis.tratamientosGral[index].examinationValueId) {
                reallythis.tratamientosGral[index].status = 'BAJ';
            }
            else {
                reallythis.tratamientosGral.splice(index, 1);
            }
        }, function (dismiss: any) {
        });
    }
    deletePracticaAnt(row: any, index: any) {
        let reallythis = this;
        swal({
            title: "¿Está seguro de borrar?",
            text: 'Pieza: ' + row.pieza_valor + ' - Cara: ' + row.examinationSubItemName,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f44336", confirmButtonText: "Borrar",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
        }).then(function () {
            reallythis.practicas_ant.splice(index, 1);
            if (reallythis.practicas_ant.length == 0) {
                reallythis.renderer.setElementClass(row.cara, 'dienteSelectedBlue', false);
                reallythis.renderer.setElementClass(row.cara, 'dienteSelectedGreen', false);
                reallythis.renderer.setElementClass(row.cara, 'dienteSelectedRed', false);
            }

            let diente = row.pieza.getElementsByClassName('diente');
            //// console.log(typeof diente);
            Array.prototype.forEach.call(diente, (element: any) => {
                reallythis.renderer.setElementClass(element, 'dienteSelectedBlue', false);
                reallythis.renderer.setElementClass(element, 'dienteSelectedRed', false);
                reallythis.renderer.setElementClass(element, 'dienteSelectedGreen', false);
            });
            reallythis.printPracticas();
        }, function (dismiss: any) {
        });
    }

    buildOdontogram(odontogram: any) {
        // debugger
        odontogram.forEach((element: any) => {
            if (element.examinationItemCode != 'LESION_UBICACION') {
                if (element.status == 'HEC' || element.status == 'PEN') {
                    let e = element;
                    e.pieza_valor = element.examinationItemCode.replace('PIEZA', '');
                    let pieza = window.document.getElementById(e.pieza_valor);
                    let cara = pieza.getElementsByClassName(e.examinationSubItemCode.toString().toUpperCase())[0];
                    // let cara = pieza.getElementsByClassName(e.examinationSubItemCode.toString().toUpperCase());
                    e.cara = cara;
                    e.pieza = pieza;
                    this.practicas.push(element);
                }
                else {
                    let e = element;
                    e.pieza_valor = element.examinationItemCode.replace('PIEZA', '');
                    let pieza = window.document.getElementById(e.pieza_valor);
                    let cara = pieza.getElementsByClassName(e.examinationSubItemCode.toString().toUpperCase())[0];
                    // let cara = pieza.getElementsByClassName(e.examinationSubItemCode.toString().toUpperCase());
                    e.cara = cara;
                    e.pieza = pieza;
                    this.practicas_ant.push(element);
                }
            }
            else if (element.examinationItemCode == 'LESION_UBICACION') {
                this.tejidosBlandos.push(element);
            }
            else {
                this.tratamientosGral.push(element);
            }
        });
        if (odontogram.length > 0)
            this.printPracticas();
    }
    clearTeeth(cara: any) {
        // if
        if (this.prePosicionDiente) {
            // debugger
            let corona = this.prePosicionDiente.getElementById('corona');
            let ausente1 = this.prePosicionDiente.getElementById('ausente1');
            let ausente2 = this.prePosicionDiente.getElementById('ausente2');
            this.renderer.setElementClass(corona, 'marcado', false)
            this.renderer.setElementClass(ausente1, 'marcado', false)
            this.renderer.setElementClass(ausente2, 'marcado', false)
            this.renderer.setElementClass(corona, 'marcadoAzul', false)
            this.renderer.setElementClass(ausente1, 'marcadoRojo', false)
            this.renderer.setElementClass(ausente2, 'marcadoRojo', false)
            this.renderer.setElementClass(corona, 'corona', true)
            this.renderer.setElementClass(ausente1, 'ausente', true)
            this.renderer.setElementClass(ausente2, 'ausente', true)
        }
        this.renderer.setElementClass(cara, 'dienteSelectedBlue', false)
        this.renderer.setElementClass(cara, 'dienteSelectedRed', false)
        this.renderer.setElementClass(cara, 'dienteSelectedGreen', false)
    }
    isSpecialtyModules(module: any) {
        let ret = false;
        this.specialtyModules.forEach((mod: any) => {
            if (!ret && mod.code == module) {
                ret = true;
                return ret;
            }
        });
        return ret;
    }

    getvaccinePersonGroup() {
        this.consultationService.getVaccinePersonGroup(this.person.id).subscribe((response: any) => {
            //// console.log('vacunas', response);
            this.vaccinePersonGroup = response;
            this.buildVaccines();
        });
    }
    inyectedVaccine(code: any) {
        let ch: any = window.document.getElementsByClassName("vaccines");
        //// console.log(ch);
        Array.prototype.forEach.call(ch, (element: any) => {
            //// console.log(element.id, element.checked);
        });
        // ch.forEach((element:any) => {
        //     //// console.log(element);
        // });
        //// console.log("object");
        return true;
    }
    buildVaccines() {
        this.consultationService.getPersonhasVaccine(this.person.id).subscribe((response: any) => {
            // this.consultationService.getPersonhasVaccine(18).subscribe((response: any) => {
            this.personHasVaccine = response;
            let ch: any = window.document.getElementsByClassName("vaccines");
            Array.prototype.forEach.call(ch, (check: any) => {
                this.personHasVaccine.forEach((element: any) => {
                    // debugger
                    let id = check.id.replace('dosage', '');
                    if (element.vaccineDosage.id == id) {
                        check.checked = true;
                        // check.disabled = true;
                    }
                });
            });

        })
    }
    checkVaccine(chek: any) {
        console.log(chek);
        if (chek.target.checked) {
            $("#modalVaccine").modal("show");
            this.currentCheckbox = chek.target;
            let id = chek.target.id.replace('dosage', '');
            this.personVaccine.vaccineDosage = { id: id };
        }
        else {
            let reallythis = this;
            swal({
                title: "¿Está seguro de Eliminar la Vacuna Seleccionada?",
                // text: row.diagnosisNomenclature.description,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#f44336", confirmButtonText: "Eliminar",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false,
                closeOnCancel: false
            }).then(function () {
                let index: any;
                let find: any = reallythis.personHasVaccine.find((vac: any, ind: any) => {
                    let id = chek.target.id.replace('dosage', '');
                    if (vac.vaccineDosage.id == id) {
                        index = ind;
                        return true;
                    }
                })
                reallythis.consultationService.deletePersonhasVaccine(reallythis.model.id, find.id).subscribe((response: any) => {
                    reallythis.dialog('Eliminado con Éxito');
                    reallythis.personHasVaccine.splice(index, 1);

                }, error => {
                    chek.target.checked = true;
                    reallythis.dialog(JSON.parse(error._body).message);
                }
                );
            }, function (dismiss: any) {
                chek.target.checked = true;
            });
        }
    }
    checkLabelVaccine(chek: any) {
        // console.log(chek.target);
        let prev = chek.target.previousSibling.previousSibling;
        // console.log(prev);
        let vaccine = prev.getElementsByClassName("vaccines")[0];
        if (vaccine && vaccine.checked) {
            //// console.log(vaccine);
            let id = vaccine.id.replace('dosage', '');
            let find: any = this.personHasVaccine.find((vac: any) => {
                if (vac.vaccineDosage.id == id)
                    return true;
            })
            this.dialogNotTada('Marca:' + (find.brand ? find.brand : 'No Posee') + ' - Lote:' + (find.lot ? find.lot : 'No Posee'), 'Centro de Salud: ' + find.healthCenter.name + ' - ' + find.dateSupply + (find.observations ? ' - ' + find.observations : ''))
            //// console.log(find);
        }
        else {
            this.dialogNotTada('El Paciente no tiene ésta vacuna colocada', '')

        }

    }
    addVaccine() {
        if (this.personVaccine) {
            this.personVaccine.person = this.person;
            this.personVaccine.healthCenter = this.healthCenter;
            this.personVaccine.consultation = { id: this.id };
            this.personVaccine.status = 'ACT';
            //// console.log(this.personVaccine);
            this.consultationService.postPersonhasVaccine(this.personVaccine).subscribe((response: any) => {
                //// console.log(response);
                this.personHasVaccine.push(response);
                this.personVaccine = {};
                // this.currentCheckbox.disabled = true;
                //// console.log(this.currentCheckbox);
                $("#modalVaccine").modal("hide");

            },
                (error: any) => {
                    this.dialog("Se produjo un Error Insperado");
                    this.personVaccine = {};
                    this.currentCheckbox.checked = false;
                    this.currentCheckbox = null;
                });
        }
        else {
            this.dialog("Verifique los datos");
        }
    }
    cancelVaccine() {
        this.personVaccine = {};
        this.currentCheckbox.checked = false;
        this.currentCheckbox = null;
    }

    initCLAP() {
        this.onSubmit(true)
        this.router.navigateByUrl('consultation/clap/' + this.id);
    }
    clearSign(ev: any) {
        let elem = ev.target;
        if (elem.value == '0')
            elem.value = '';
    }
    goCLAP() {
        this.router.navigateByUrl('consultation/clap/' + this.historyConsultation.id + '/history/' + this.historyConsultation.clapId);
    }
}
