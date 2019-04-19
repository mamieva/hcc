import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { OperatorService } from '../../../services/operator.service';

declare const swal: any;
@Component({
    selector: 'operator-list-cmp',
    moduleId: module.id,
    templateUrl: 'operator.list.component.html'
})

export class OperatorListComponent implements OnInit {

    @ViewChild('inputValor') element: ElementRef;

    searchResult: any = {};
    currentPage: number = 0;
    pageSize: number = 10;
    showSearchInput = false;
    title: string = "Operadores";
    model: any = { search: '' };
    searchResultFiltered: any = {};
    search: any = '';
    page: number = 0;
    size: number = 20;
    totalPages: number;
    healthCenter: any;

    constructor(private route: ActivatedRoute, private router: Router, private operatorService: OperatorService) {
        let really = this;
        operatorService.getAllOperators(this.search, this.page, this.size).subscribe((response: any) => {
            this.healthCenter = JSON.parse(localStorage.getItem("healthCenterHasOperator")).healthCenter;
            this.searchResult = response;
            this.totalPages = response.page.totalPages;
            this.searchResultFiltered.content = this.searchResult.content.map((i: any) => { return i; });
            this.searchResultFiltered.content.map((element:any) => {
                if(element.healthCenterHasOperator != null){
                    let hc = element.healthCenterHasOperator.find((r:any)=>{
                        // debugger
                        return r.healthCenter.id == really.healthCenter.id;
                    });
                    element.status = hc.status;
                    // console.log(hc);
                }
                return element;
            });
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

    moveToPage(move: any) {
        // console.log('move',move);
        // console.log('page',this.page);
        // console.log('tpage',this.totalPages);
        if (this.page + move >= 0 && this.page + move <= this.totalPages - 1) {
            this.page = this.page + move;
            this.operatorService.getAllOperators(this.search, this.page, this.size).subscribe((response: any) => {
                this.searchResult = response;
                this.searchResultFiltered.content = this.searchResult.content.map((i: any) => { return i; });
            });

        }
    }

    filterList(ev: any) {
        // //
        // this.searchResultFiltered.content = this.searchResult.content.map(i => { return i; });
        // //
        // // console.log(encodeURIComponent(this.model.search));
        // this.searchResultFiltered.content = this.searchResultFiltered.content.filter(it => {
        //     return it.userName.toUpperCase().indexOf(this.model.search.toUpperCase()) >= 0 ||
        //         it.email.toUpperCase().indexOf(this.model.search.toUpperCase()) >= 0 ||
        //         it.id.toString().toUpperCase().indexOf(this.model.search.toUpperCase()) >= 0;
        //     // ||
        //     // it.roles.toUpperCase().indexOf(this.model.search.toUpperCase()) >= 0;
        // });
        this.operatorService.getAllOperators(this.model.search, this.page, this.size).subscribe((response: any) => {
            this.searchResult = response;
            this.totalPages = response.page.totalPages;
            this.searchResultFiltered.content = this.searchResult.content.map((i: any) => { return i; });
        });
    }

    newOperator() {
        this.router.navigateByUrl('/operator/');
    }

    openRow(operatorId: number) {
        this.router.navigateByUrl('/operator/' + operatorId);
    }
    showSearch(ev: any) {
        this.showSearchInput = !this.showSearchInput
        this.model.search = '';
        this.filterList(ev);
        if (this.showSearchInput) {
            setTimeout(() => {
                this.element.nativeElement.focus();
            }, 200);
        }
        // this.element.nativeElement.focus();
        // // console.log(this.element.nativeElement);
    }
    deleteRow(ev: any) {
        let obj: OperatorListComponent = this;
        swal({
            title: "¿Está seguro de borrar?",
            text: "Operador " + ev.userName,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f44336", confirmButtonText: "Borrar",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
        }).then(function () {
            obj.operatorService.deleteOperator(ev.id).subscribe((response: any) => {
                obj.operatorService.getAllOperators(obj.search, obj.page, obj.size).subscribe((res: any) => {
                    obj.searchResult = res;
                    obj.searchResultFiltered.content = obj.searchResult.content.map((i: any) => { return i; });
                });
            }, error => {
                // // console.log(JSON.parse(error));
                swal({
                    title: 'Se Produjo un Error! Verifique sus Permisos',
                    animation: false,
                    customClass: 'animated tada',
                    confirmButtonColor: '#f44336'
                });
            });

        }, function (dismiss: any) {
        });
    }
}
