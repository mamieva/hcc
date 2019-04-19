import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { HealthCenterService } from '../../../services/health.center.service';

declare const swal: any;

@Component({
    selector: 'healthcenter-list-cmp',
    moduleId: module.id,
    templateUrl: 'healthcenter.list.component.html'
})

export class HealthcenterListComponent implements OnInit {
    searchResult: any = {};
    searchResultFiltered: any = {};
    currentPage: number = 0;
    pageSize: number = 10;
    showSearchInput = false;
    title: string = "Centros de Salud";
    model: any = {};

    constructor(private route: ActivatedRoute, private router: Router, private healthCenterService: HealthCenterService) {
        this.getHealthCenters();
    }

    ngOnInit() {
        document.querySelector('#top').scrollIntoView({ behavior: 'smooth' });
    }

    getHealthCenters() {
        this.healthCenterService.getAllHealthCenters().subscribe(response => {
            this.searchResult = response;
            this.searchResultFiltered.content = [];
            for (let row of this.searchResult.content)
                this.searchResultFiltered.content.push(row);
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
        let list: any[];
        this.searchResultFiltered.content = [];
        for (let h of this.searchResult.content)
            this.searchResultFiltered.content.push(h);
        list = this.searchResultFiltered.content;
        this.searchResultFiltered.content = list.filter(it =>
            (it.name && it.name.toUpperCase().includes(this.model.search.toUpperCase()))
            || (it.address && it.address.toUpperCase().includes(this.model.search.toUpperCase()))
            || (it.city && it.city.name.toUpperCase().includes(this.model.search.toUpperCase()))
        );
    }

    newCenter() {
        this.router.navigateByUrl('/healthcenter/');
    }

    openRow(centerId: number) {
        this.router.navigateByUrl('/healthcenter/' + centerId);
    }

    deleteRow(row: any) {
        let cmp: HealthcenterListComponent = this;
        swal({
            title: '¿Está seguro de borrar el centro de salud?',
            text: row.name,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f44336',
            //cancelButtonColor: '#d33',
            confirmButtonText: 'Borrar',
            cancelButtonText: 'Cancelar'
          }).then(function () {
              cmp.healthCenterService.deleteHealthCenter(row.id).subscribe((response: any) => {
                swal(
                    'Borrado!',
                    row.name,
                    'success'
                );
                cmp.getHealthCenters();
              });
          });
    }
}
