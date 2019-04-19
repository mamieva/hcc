import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PlanningService } from '../../../services/planning.service';

declare const swal: any;

@Component({
    selector: 'planning-list-cmp',
    moduleId: module.id,
    templateUrl: 'planning.list.component.html'
})

export class PlanningListComponent implements OnInit {
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
    currentUser: any;
    schedules: any[] = [];

    constructor(private route: ActivatedRoute, private router: Router, private planningService: PlanningService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        // console.log(this.currentUser);
        this.getPlannings(this.currentUser.person.id);
    }

    ngOnInit() {
        document.querySelector('#top').scrollIntoView({ behavior: 'smooth' });
    }

    getPlannings(personId : number) {

        this.planningService.getMedicalPlanning(personId).subscribe((response:any)=>{
            // console.log(response);
            this.listFiltered = response;
        });
        // this.planningService.getAllPlannings(this.search, this.page, this.size).subscribe((response: any) => {
        //     this.searchResult = response;
        //     // this.totalPages = response.page.totalPages;
        //     this.listFiltered = response.map((response: any) => {return response;})
        //     // this.listFiltered = [];
        //     // for (let s of this.searchResult.content) {
        //     //     this.listFiltered.push(s);
        //     // }

        // });
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
        // this.planningService.getAllPlannings(this.model.search, '', '').subscribe((response: any) => {
        //     this.listFiltered = response.content;
        // });




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

    newCenter() {
        this.router.navigateByUrl('/planning/');
    }

    openRow(row:any) {
        this.planningService.getMedicalPlanningDateProfessional(row.id).subscribe((response:any)=>{
            // console.log(response);
            this.schedules = response;
        });
        // this.router.navigateByUrl('/planning/' + planningId);
    }

    deleteRow(row: any) {
        let cmp: PlanningListComponent = this;
        swal({
            title: 'Está seguro de borrar al profesional?',
            text: row.person.lastName + ', ' + row.person.firstName,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f44336',
            //cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrarlo!',
            cancelButtonText: 'Cancelar'
        }).then(function () {
            // cmp.planningService.deletePlanning(row.id).subscribe((response: any) => {
            //     swal(
            //         'Borrado!',
            //         row.name,
            //         'success'
            //     );
            //     cmp.getPlannings();
            // });
        });
    }
    moveToPage(move: any) {
        // console.log('move', move);
        // console.log('page', this.page);
        // console.log('tpage', this.totalPages);
        if (this.page + move >= 0 && this.page + move <= this.totalPages - 1) {
            this.page = this.page + move;
            // this.planningService.getAllPlannings(this.search, this.page, this.size).subscribe((response: any) => {
            //     this.searchResult = response;
            //     this.listFiltered = this.searchResult.content.map((i: any) => { return i; });
            // });

        }
    }
}
