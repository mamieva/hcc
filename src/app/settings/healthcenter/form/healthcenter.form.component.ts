import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { HealthCenterService } from '../../../services/health.center.service';
import { CityService } from '../../../services/city.service';
declare const swal: any;

@Component({
    selector: 'healthcenter-form-cmp',
    moduleId: module.id,
    templateUrl: 'healthcenter.form.component.html'
})

export class HealthcenterFormComponent implements OnInit {
    title: string = "Nuevo Centro de Salud";
    center: any = {city: {}};
    centerId: number;
    cities: any[];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private healthCenterService: HealthCenterService,
        private cityService: CityService
    ) {
        this.route.params.subscribe(params => {
            this.centerId = +params.id;
        });
        if (this.centerId) {
            this.title = "Modificar Centro de Salud";
            healthCenterService.getHealthCenter(this.centerId).subscribe(response => {
                this.center = response;
                this.center.isPublic = this.center.isPublic == '1' ? true : false;
                this.center.city = this.center.city ? this.center.city : {};
                this.center.enabled = this.center.status == 'ACT';
                // console.log(this.center);
            });
        }
        cityService.getCities().subscribe((response: any) => {
            this.cities = response;
        });
    }

    ngOnInit() {
        document.querySelector('#top').scrollIntoView({ behavior: 'smooth' });
    }

    onSubmit() {
        this.center.status = this.center.enabled ? 'ACT' : 'BAJ';
        this.center.isPublic = this.center.isPublic ? '1' : '0';
        // console.log(this.center);
        this.healthCenterService.saveHealthCenter(this.center).subscribe(response => {
            this.router.navigateByUrl('healthcenterlist');
        },
        error => {
            let msg = JSON.parse(error._body).message;
            alert(msg);
        });
    }
    cancelSubmit() {
        this.router.navigateByUrl('healthcenterlist');
    }
    dialog(msg: string) {
        swal({
            title: msg,
            animation: false,
            customClass: 'animated tada',
            confirmButtonColor: '#f44336'
        });
    }
}
