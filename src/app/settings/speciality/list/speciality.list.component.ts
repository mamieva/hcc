import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SpecialityService } from '../../../services/speciality.service';

@Component({
    selector: 'speciality-list-cmp',
    moduleId: module.id,
    templateUrl: 'speciality.list.component.html'
})

export class SpecialityListComponent implements OnInit {
    showSearchInput = false;
    title: string = "Especialidades";
    model: any = {};
    list: any[];
    filteredList: any[];

    constructor(private route: ActivatedRoute, private router: Router, specialityService: SpecialityService) {
        specialityService.getSpecialities().subscribe((response: any) => {
            this.list = response;
            this.filteredList = [];
            for (let l of this.list) {
                this.filteredList.push(l);
            }
        });
    }

    ngOnInit() {
        document.querySelector('#top').scrollIntoView({ behavior: 'smooth' });
    }

    doSearch(ev: any) {
        let list: any[];
        this.filteredList = [];
        for (let h of this.list)
            this.filteredList.push(h);
        list = this.filteredList;
        this.filteredList = list.filter(it =>
            (it['name'] && it['name'].toUpperCase().includes(this.model.search.toUpperCase()))
        );
    }

    newCenter() {
        this.router.navigateByUrl('/speciality/');
    }

    openRow(specialityId: number) {
        this.router.navigateByUrl('/speciality/' + specialityId);
    }
}
