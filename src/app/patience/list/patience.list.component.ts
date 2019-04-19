import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PersonService } from '../../services/person.service';
import { ScheduleService } from '../../services/schedule.service';
import { CareserviceService } from '../../services/careservice.service';
import { OperatorService } from '../../services/operator.service';

declare const swal: any;
declare const $: any;

@Component({
    selector: 'patience-list-cmp',
    moduleId: module.id,
    templateUrl: 'patience.list.component.html'
})

export class PatienceListComponent implements OnInit {
    searchResult: any = {};
    currentPage: number = 0;
    pageSize: number = 10;
    showSearchInput = false;
    title: string = "Profesionales";
    model: any = {};
    listFiltered: any[];
    search: any = '';
    page: number = 0;
    size: number = 20;
    totalPages: number;
    patience: any;
    documentNumber: any;
    sex: any;
    createPatience: boolean = false;
    isPlanning: boolean = false;
    assignSchedule: boolean = false;
    currentUser: any;
    currentHC: any;
    careServices: any[] = [];
    careServiceId: number;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private patienceService: PersonService,
        private scheduleService: ScheduleService,
        private operatorService: OperatorService,
        private careServiceService: CareserviceService) {
        // this.getPatiences();
        let operatorId = JSON.parse(localStorage.getItem('currentUser')).authToken.claims.scopes.id;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.isPlanning = JSON.parse(localStorage.getItem('healthCenterHasOperator')).healthCenter.isPlanning;
        this.currentHC = JSON.parse(localStorage.getItem('healthCenterHasOperator')).healthCenter;
        this.operatorService.getOperator(operatorId).subscribe((response: any) => {
            // debugger;
            let roles: any[] = response.healthCenterHasOperator[0].profile.profileRoles;
            // console.log(roles);
            if (this.contains(roles, 'PERSON_CREATE'))
                this.createPatience = true;
            if (this.contains(roles, 'PROFESSIONAL_SCHEDULE'))
                this.assignSchedule = true;
        });
        this.careServiceService.getServiceByProfessionalHC(this.currentUser.person.id, this.currentHC.id).subscribe((response: any) => {
            this.careServices = response;
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

    getPatiences() {
        this.patienceService.getAllPerson().subscribe((response: any) => {
            this.searchResult = response;
            // this.totalPages = response.page.totalPages;
            this.listFiltered = response.map((response: any) => { return response; })
            // this.listFiltered = [];
            // for (let s of this.searchResult.content) {
            //     this.listFiltered.push(s);
            // }
        });
    }

    getPagingInfo() {
        if (this.searchResult.page.totalElements == 0) {
            return "";
        }
        let from: number = this.searchResult.page.number * this.searchResult.page.size + 1;
        let to: number = (this.searchResult.page.number + 1) * this.searchResult.page.size;
        if (to > this.searchResult.page.totalElements) {
            to = this.searchResult.page.totalElements;
        }
        return from + "-" + to + " de " + this.searchResult.page.totalElements;
    }

    filterList(ev: any) {
        // // console.log(ev);
        this.patienceService.getAllPerson().subscribe((response: any) => {
            this.listFiltered = response.content;
        });




        // let list: any[];
        // this.listFiltered = [];
        // for (let p of this.searchResult)
        //     this.listFiltered.push(p);
        // list = this.listFiltered;
        // this.listFiltered = list.filter(it =>
        //     (it['person'] && it['person'].firstName.toUpperCase().includes(this.model.search.toUpperCase()))
        //     || (it['person'] && it['person'].lastName.toUpperCase().includes(this.model.search.toUpperCase()))
        //     || (it['person'] && it['person'].docNumber.toUpperCase().includes(this.model.search.toUpperCase()))
        //     || (it['person'] && it['person'].email.toUpperCase().includes(this.model.search.toUpperCase()))
        //     || (it['person'] && it['person'].phone.toUpperCase().includes(this.model.search.toUpperCase()))
        //     || (it['matricula'] && it['matricula'].toUpperCase().includes(this.model.search.toUpperCase()))
        // );
    }

    newPatience() {
        this.router.navigateByUrl('/patience/');
    }

    openRow(patienceId: any) {
        this.router.navigateByUrl('/patience/' + patienceId);
    }
    findPerson() {
        this.patienceService.getByDocumentAndSex(this.documentNumber, this.sex).subscribe(
            response => {
                this.patience = response;
                if (this.patience) {
                    // this.closeService(this.documentNumber);
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
    closePatience(search: string) {
        this.patience = null;
        this.documentNumber = '';
        this.sex = '';
    }
    moveToPage(move: any) {
        // console.log('move', move);
        // console.log('page', this.page);
        // console.log('tpage', this.totalPages);
        if (this.page + move >= 0 && this.page + move <= this.totalPages - 1) {
            this.page = this.page + move;
            this.patienceService.getAllPerson().subscribe((response: any) => {
                this.searchResult = response;
                this.listFiltered = this.searchResult.content.map((i: any) => { return i; });
            });

        }
    }
    sendTurno() {
        localStorage.setItem('currentPatience', JSON.stringify(this.patience));
        this.router.navigateByUrl("/schedule");
    }
    assignSchedulePatience() {
        let schedule: any = {};
        let date = new Date();
        schedule.overSchedule = true;
        schedule.person = {
            id: this.patience.id
        };
        schedule.professional = {
            id: this.currentUser.person.id
        };
        schedule.service = {
            id: this.careServiceId
        }
        let dateString = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        schedule.scheduledDateFrom = dateString;
        schedule.scheduledDateTo = dateString;
        schedule.telemedicine = false;
        //
        this.scheduleService.assignSchedulePatience(schedule).subscribe((response: any) => {
            $("#modalInterconsultation").modal("hide");
            swal({
                title: 'Asignación Exitosa',
                animation: false,
                customClass: 'animated tada',
                confirmButtonColor: '#f44336'
            });
        }, (error: any) => {
            let err: any = JSON.parse(error._body);
            swal({
                title: err.message,
                animation: false,
                customClass: 'animated tada',
                confirmButtonColor: '#f44336'
            });
        });
    }
}
