import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CareserviceService } from '../../../services/careservice.service';
import { AnonymousSubject } from 'rxjs';

declare const swal: any;

@Component({
    selector: 'careservice-list-cmp',
    moduleId: module.id,
    templateUrl: 'careservice.list.component.html'
})

export class CareserviceListComponent implements OnInit {
    searchResult: any = {};
    searchResultFiltered: any = {};
    currentPage: number = 0;
    pageSize: number = 10;
    showSearchInput = false;
    title: string = "Planificación de Servicios";
    model: any = {};
    search: any = '';
    page: number = 0;
    size: number = 20;
    totalPages: number;

    constructor(private route: ActivatedRoute, private router: Router, private careserviceService: CareserviceService) {
        careserviceService.getAllCareservicesSearch('',this.page,this.size).subscribe((response:any) => {
            this.searchResult = response;
            this.searchResultFiltered.content = [];
            this.totalPages = response.page.totalPages;
            for (let row of this.searchResult.content) {
                this.searchResultFiltered.content.push(row);
            }
        });
    }

    ngOnInit() {
        document.querySelector('#top').scrollIntoView({ behavior: 'smooth' });
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

        this.careserviceService.getAllCareservicesSearch(this.model.search,this.page,this.size).subscribe((response:any) =>{
            this.searchResultFiltered.content = response.content;
            this.totalPages = response.page.totalPages;
        });


        // let list: any[];
        // let i;
        // this.searchResultFiltered.content = [];
        // for (i = 0; i < this.searchResult.content.length; i++)
        //     this.searchResultFiltered.content.push(this.searchResult.content[i])
        // list = this.searchResultFiltered.content;
        // this.searchResultFiltered.content = list.filter(it =>
        //     (it['name'] && it['name'].toUpperCase().includes(this.model.search.toUpperCase()))
        //     || (it['address'] && it['address'].toUpperCase().includes(this.model.search.toUpperCase()))
        //     || (it['city'] && it['city'].toUpperCase().includes(this.model.search.toUpperCase()))
        // );
    }

    newService() {
        this.router.navigateByUrl('/careservice/');
    }

    openRow(centerId: number) {
        this.router.navigateByUrl('/careservice/' + centerId);
    }

    deleteService(service: any) {
        service.status = 'BAJ';
        let cmp: CareserviceListComponent = this;
        swal({
            title: '¿Está seguro de eliminar?',
            text: 'Servicio de ' + service.name,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f44336',
            //cancelButtonColor: '#d33',
            confirmButtonText: 'Borrar',
            cancelButtonText: 'Cancelar'
        }).then(function () {
            // service.status = 'INA';
            cmp.careserviceService.putService(service.id, service).subscribe((response: any) => {
                // // console.log(response);
                cmp.careserviceService.getAllCareservices().subscribe((response: any) => {
                    cmp.searchResult = response;
                    cmp.searchResultFiltered.content = [];
                    for (let row of cmp.searchResult.content) {
                        cmp.searchResultFiltered.content.push(row);
                    }
                });
                // location.reload();
            }, (error: any) => {
                swal(
                    'Error!',
                    error.message,
                    'success'
                );
            });
        });
    }

    openUrl(url: string) {
        this.router.navigateByUrl(url);
    }
    moveToPage(move: any) {
        // console.log('move', move);
        // console.log('page', this.page);
        // console.log('tpage', this.totalPages);
        if (this.page + move >= 0 && this.page + move <= this.totalPages - 1) {
            this.page = this.page + move;
            this.careserviceService.getAllCareservicesSearch(this.search, this.page, this.size).subscribe((response: any) => {
                this.searchResult = response;
                this.searchResultFiltered.content = this.searchResult.content.map((i: any) => { return i; });
            });

        }
    }
}
