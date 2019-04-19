import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import { ISubscription } from "rxjs/Subscription";
import { Router, ActivatedRoute } from '@angular/router';
import { WebsocketService } from '../services/util/websocket.service';
import { ConsultationService } from '../services/consultation.service';
import { QuestionService } from '../services/question.service';
import { QuestionControlService } from '../services/question-control.service';
import { LoadingService } from '../services/util/loading.service';

declare var $: any;
declare var alert: any;
declare const swal: any;

@Component({
    selector: 'sign-cmp',
    moduleId: module.id,
    templateUrl: 'sign.component.html',
    providers: [QuestionService, QuestionControlService, ConsultationService]
})

export class SignComponent implements OnInit {
    model: any = {};
    loading = false;
    user: any = {};
    attempts: number = -1;
    consulta: any;
    files: any[];
    pending: number;
    procedureid: string = '-1';
    mock: boolean = false;
    filterCertificate: String = 'ALL';
    readingCertificates = false;
    private subscription: ISubscription;
    look: string = "";
    currentUser: any; //User;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private wsService: WebsocketService,
        private questionService: QuestionService,
        private cdr: ChangeDetectorRef,
        private consultationService: ConsultationService,
        private loadingService: LoadingService
    ) {
        this.loadingService.enableShowSpinner();
        // console.log("*********** CONSTRUCTOR *******************");
        this.wsService.init();
        //this.look = sessionStorage.getItem('look') === undefined ? 'default' : sessionStorage.getItem('look');

        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.look = localStorage.getItem('look_backend');
        // console.log("look BACKEND frequent" + this.look);

        this.subscription = this.wsService.websocket.subscribe(msg => {
            // console.log(msg);
            // console.log("*********** SUBSCRIPTIOON *******************");
            var color = "#ac1f7f"
            if (this.look == "BLACK") {
                color = "#000000";
            }

            //// console.log("***MENSAJE**");
            //// console.log(msg);

            if (msg[0] == '[') {
                // // console.log("***IF ARRAY**");

                this.readingCertificates = false;
                var list = JSON.parse(msg);
                // console.log('LIST', list);
                var i, arr;
                if (list.length == 0) {
                    alert('CIPE no válida para firmar este trámite', color);
                    return;
                }
                arr = [];
                for (i = 0; i < list.length; i++) {
                    arr.push({ key: list[i].position + 1, value: list[i].name });
                }
                this.user.options = arr;
                // // console.log(this.user.options);
                // console.log('arreglop', arr[0]);
                this.model.username = arr[0].key;
            }
            else {
                if (msg[0] == '{') {
                    //// console.log("***IF JSON**"); 

                    var fileuploaded = JSON.parse(msg);
                    if (fileuploaded.result == 'OK') {
                        // console.log("***IF JSON OK**");
                        // this.pending--;
                        // if (this.pending == 0) {
                        // console.log("***IF JSON PENDING 0**");
                        // this.consultaService.endById(this.consulta.procedure.procedureId).subscribe(result => {
                        //     localStorage.removeItem('consulta');
                        //     this.wsService.close();
                        //     this.subscription.unsubscribe();
                        //     this.router.navigate(['/']);
                        // });
                        // this.consultationService.endConsultation(this.consulta.procedure.id, this.consulta.procedure).subscribe((response: any) => {
                        this.disableShowSpinner();
                        this.cdr.detectChanges();
                        localStorage.removeItem('consulta');
                        this.subscription.unsubscribe();
                        swal({
                            title: 'Firmado y Enviado con Éxito',
                            animation: false,
                            customClass: 'animated tada',
                            confirmButtonColor: '#f44336'
                        }).then(() => {
                            this.router.navigate(['/today']);
                        });
                        // });
                        // console.log("*********** FIN SUBSCRIPTION disableShowSpinner*******************");
                        // }
                        // else {
                        // if (this.pending < this.files.length)
                        //     this.files = this.files.splice(1);
                        // this.consulta.file = this.files[0];
                        // this.consulta.code = "ADJTRAMIX";
                        // // console.log("***IF JSON ADJTRAMIX**");
                        // // console.log("Sending consulta:" + this.consulta);
                        // // console.log("Sending file:" + this.consulta.file.originalName);
                        // // console.log("pending=" + this.pending);
                        // this.wsService.websocket.next(JSON.stringify(this.consulta));
                        // }
                        // this.wsService.close();
                        this.disableShowSpinner();
                    }
                    else if (fileuploaded.result == 'ERROR') {
                        swal({
                            title: 'Se Produjo un Error. Contactese con un Administrador',
                            animation: false,
                            customClass: 'animated tada',
                            confirmButtonColor: '#f44336'
                        });
                        // alert('Se Produjo un Error', color);
                        this.disableShowSpinner();
                    }
                }
                else if (msg == "OK") {
                    // console.log("***IF PIN OK ACTTRAMIX **");
                    this.consulta = JSON.parse(localStorage.getItem('consulta'));
                    // // console.log(this.consulta);
                    // this.consulta.selectedCertificate = this.model.username;
                    // this.consulta.pin = this.model.password;
                    // this.files = this.consulta.files;
                    // this.consulta.files = null;
                    // this.pending = this.files.length + 1;
                    // this.consulta.code = "ACTTRAMIX";
                    //
                    // let proceduretypeid = this.consulta.procedure.scheduleId != null ? this.consulta.procedure.scheduleId : -1;
                    // let procedureid = this.consulta.procedure.id != null ? this.consulta.procedure.id : -1;
                    let procedureid;
                    if (this.consulta.procedure.scheduleId != null){
                        procedureid = this.consulta.procedure.scheduleId;
                    }
                    else{
                        procedureid = this.consulta.procedure.id;
                    }
                    let code = this.consulta.procedure.id != null ? 'DIAG' : 'ORDER';
                    let json = {
                        url: this.consulta.url,
                        xAuthentication: this.consulta.xAuthentication,
                        selectedCertificate: this.model.username,
                        pin: this.model.password,
                        procedure: {
                            procedureId: procedureid
                        },
                        file: {
                            id: "0",
                            mimeType: "application/pdf",
                            originalName: "base64.pdf",
                            base64: this.consulta.files[0]
                        },
                        code: code
                    };
                    //
                    // console.log(json);
                    this.wsService.websocket.next(JSON.stringify(json));
                    // console.log("*************** PIN OK");
                }
                else {
                    // console.log("***IF ATTEMPS**");
                    this.attempts = +msg.split("ATTEMPS ")[1];
                    this.disableShowSpinner();
                    swal({
                        title: 'PIN Incorrecto, le quedan: ' + this.attempts + ' intentos',
                        animation: false,
                        customClass: 'animated tada',
                        confirmButtonColor: '#f44336'
                    });
                }
            }
        });
        // console.log("*********** FIN SUBSCRIPTION 2 *******************");
        this.disableShowSpinner();
    }

    ngOnInit() {
        // this.changeStyle();
    }

    changeStyle() {
        //// console.log("******** VER LOOK detail : " + this.look);
        if (this.look == "BLACK") {
            $("button.btn.btn-primary").css("background-color", "#000000");
            $(".card-header").css("background-color", "#000000");
            $(".title").css("background-color", "#000000");

            $("#nav-container").css("display", "nonoe");
            $("#nav-container-BLACK").css("display", "block");
        }
        else {
            $("button.btn.btn-primary").css("background-color", "#ac1f7f");
            $(".card-header").css("background-color", "#ac1f7f");
            $(".title").css("background-color", "#ac1f7f");

            $("#nav-container").css("display", "block");
            $("#nav-container-BLACK").css("display", "none");
        }
    }


    getCertificates() {
        // debugger
        // console.log("*********** GET CERTIFICATES *******************");
        this.consulta = JSON.parse(localStorage.getItem('consulta'));
        // // console.log(this.consulta.procedure);
        // this.procedureid=this.consulta.procedure.id;
        this.readingCertificates = true;
        // console.log(this.readingCertificates);
        // this.questionService.getSecureOrganizations(this.procedureid).subscribe(response => {
        // //Para firmar consulta de ciudadano cambio el OID
        // if(response.oidOrganization == 'OID:2.16.32.1.3.2.1.1.3'){
        //     response.oidOrganization = '2.16.32.1.3.2.1.1.2';
        // }
        // // console.log("oidOrganization: " + response.oidOrganization);  
        //     this.filterCertificate = response.oidOrganization + " "+ response.codsolicitante; 
        //     //// console.log("filterCertificate: " +this.filterCertificate);         
        // this.wsService.websocket.next("GET_SIGN_CERTIFICATES"+ this.filterCertificate);          
        this.wsService.websocket.next("GET_SIGN_CERTIFICATES");
        //    // // console.log("DENTRO DEL SECURE");
        //     //// console.log(this.readingCertificates);
        // console.log("*********** FIN GET CERTIFICATES *******************");
        // },
        // error => {
        //             //alert("Error al obtener Organizations");
        //             this.readingCertificates=false;
        // });

        // console.log("*********** FIN 2 GET CERTIFICATES *******************");
    }

    validatePIN() {
        // console.log("*********** VALIDAR PIN enableShowSpinner*******************");
        this.wsService.websocket.next("PIN" + this.model.password);
        this.loadingService.enableShowSpinner();
    }

    showSpinner() {
        this.cdr.detectChanges();
        // console.log("*********** showSpinner mustShowSpinner*******************");
        return this.loadingService.mustShowSpinner();
    }
    disableShowSpinner() {
        // this.cdr.detectChanges();
        // console.log("*********** showSpinner mustShowSpinner*******************");
        return this.loadingService.disableShowSpinner();
    }
}