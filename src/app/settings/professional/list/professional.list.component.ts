import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ProfessionalService } from '../../../services/professional.service';

declare const swal: any;

@Component({
    selector: 'professional-list-cmp',
    moduleId: module.id,
    templateUrl: 'professional.list.component.html'
})

export class ProfessionalListComponent implements OnInit {
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

    constructor(private route: ActivatedRoute, private router: Router, private professionalService: ProfessionalService) {
        this.getProfesionals();
    }

    ngOnInit() {
        document.querySelector('#top').scrollIntoView({ behavior: 'smooth' });
    }

    getProfesionals() {
        this.professionalService.getAllProfessionals().subscribe((response: any) => {
            this.searchResult = response;
            this.totalPages = response.page.totalPages;
            this.listFiltered = [];
            for (let s of this.searchResult.content) {
                this.listFiltered.push(s);
            }
            
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
        this.professionalService.getProfessionals(this.model.search,'','').subscribe((response:any) =>{
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

    newCenter() {
        this.router.navigateByUrl('/professional/');
    }

    openRow(professionalId: number) {
        this.router.navigateByUrl('/professional/' + professionalId);
    }

    deleteRow(row: any) {
        // console.log(row);
        let cmp: ProfessionalListComponent = this;
        swal({
            title: '¿Está seguro de borrar al profesional?',
            text: row.person.lastName + ', ' + row.person.firstName,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f44336',
            //cancelButtonColor: '#d33',
            confirmButtonText: 'Borrar',
            cancelButtonText: 'Cancelar'
        }).then(function () {
            cmp.professionalService.deleteProfessional(row.id).subscribe((response: any) => {
                cmp.getProfesionals();
            });
        });
    }
    moveToPage(move: any) {
        // console.log('move', move);
        // console.log('page', this.page);
        // console.log('tpage', this.totalPages);
        if (this.page + move >= 0 && this.page + move <= this.totalPages - 1) {
            this.page = this.page + move;
            this.professionalService.getProfessionals(this.search, this.page, this.size).subscribe((response: any) => {
                this.searchResult = response;
                this.listFiltered = this.searchResult.content.map((i: any) => { return i; });
            });

        }
    }
}
