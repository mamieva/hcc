import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ProfileService } from '../../../services/profile.service';

declare const swal: any;
@Component({
    selector: 'profile-list-cmp',
    moduleId: module.id,
    templateUrl: 'profile.list.component.html'
})

export class ProfileListComponent implements OnInit {

    @ViewChild('inputValor') element: ElementRef;

    searchResult: any = {};
    currentPage: number = 0;
    pageSize: number = 10;
    showSearchInput = false;
    title: string = "Perfiles";
    model: any = { search: '' };
    searchResultFiltered: any = {};

    constructor(private route: ActivatedRoute, private router: Router, private profileService: ProfileService) {
        profileService.getAllProfiles().subscribe(response => {
            // console.log(response);
            this.searchResult = response;
            this.searchResultFiltered.content = this.searchResult.map((i: any) => { return i; });
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
        //Valores por referencia
        this.searchResultFiltered.content = this.searchResult.map(i => { return i; });
        //
        // console.log(encodeURIComponent(this.model.search));
        this.searchResultFiltered.content = this.searchResultFiltered.content.filter(it => {
            return it.name.toUpperCase().indexOf(this.model.search.toUpperCase()) >= 0 ||
                it.description.toUpperCase().indexOf(this.model.search.toUpperCase()) >= 0 ||
                it.id.toString().toUpperCase().indexOf(this.model.search.toUpperCase()) >= 0;
            // ||
            // it.roles.toUpperCase().indexOf(this.model.search.toUpperCase()) >= 0;
        });
    }

    newProfile() {
        this.router.navigateByUrl('/profile/');
    }

    openRow(profileId: number) {
        this.router.navigateByUrl('/profile/' + profileId);
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
        let obj: ProfileListComponent = this;
        swal({
            title: "¿Está seguro de borrar?",
            text: "Perfil " + ev.name,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f44336", confirmButtonText: "Borrar",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false,
            closeOnCancel: false
        }).then(function () {
            obj.profileService.deleteProfile(ev.id).subscribe(response => {
                // // console.log('response',response);
                obj.profileService.getAllProfiles().subscribe(res => {
                    obj.searchResultFiltered.content = res;
                    // obj.searchResultFiltered.content = res.content.map((i: any) => { return i; });
                });
            }, error => {
                // console.log(error);
            });

        }, function (dismiss: any) {
        });
    }
    // Si hay paginado..
    // moveToPage(move: any) {
    //     // console.log('move',move);
    //     // console.log('page',this.page);
    //     // console.log('tpage',this.totalPages);
    //     if (this.page + move >= 0 && this.page + move <= this.totalPages - 1) {
    //         this.page = this.page + move;
    //         this.operatorService.getAllOperators(this.search, this.page, this.size).subscribe((response: any) => {
    //             this.searchResult = response;
    //             this.searchResultFiltered.content = this.searchResult.content.map((i: any) => { return i; });
    //         });

    //     }
    // }
}
