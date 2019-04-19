import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { PersonService } from '../../services/person.service';
import { HealthCenterService } from '../../services/health.center.service';

declare const swal: any;

@Component({
    selector: 'patience-form-cmp',
    moduleId: module.id,
    templateUrl: 'patience.form.component.html'
})

export class PatienceFormComponent implements OnInit {
    title: string = "Paciente: ";
    patience: any;
    healthCenters: any[];
    model: any = {
        typeService: "PROG"
    };
    id: number;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private personService: PersonService,
        private healthCenterService: HealthCenterService) {
        this.route.params.subscribe(params => {
            this.id = +params.id;
        });
        this.patience = JSON.parse(localStorage.getItem('currentPatience'));
        this.setPhoto(this.patience);
        this.healthCenterService.getAllHealthCenters().subscribe((response: any) => {
            this.healthCenters = response.content;
        });
    }

    ngOnInit() {
        document.querySelector('#top').scrollIntoView({ behavior: 'smooth' });
    }

    changeHealthCenter(healthCenter: any) {
        this.patience.healthCenter = healthCenter;
    }

    dialog(msg: string) {
        swal({
            title: msg,
            animation: false,
            customClass: 'animated tada',
            confirmButtonColor: '#f44336'
          });
    }

    onSubmit() {
        if (!this.patience.healthCenter) {
            this.dialog("Seleccione Centro de Salud");
            return;
        }
        this.personService.savePerson(this.patience).subscribe((response: any) => {
            localStorage.setItem('currentPatience', JSON.stringify(this.patience));
            this.location.back();
        });
    }

    setPhoto(person: any) {
        if (person.photoBase64 && !person.photoBase64.startsWith('/assets/')) {
            person.tmpPhoto = 'data:image;base64,' + person.photoBase64;
        }
        else {
            let genre: string;
            if (person.sex == 'F') {
                genre = 'woman';
            }
            else {
                genre = 'man';
            }
            person.tmpPhoto = '/assets/img/silhouette-' + genre + '-grey.png';
        }
    }

    close() {
        this.location.back();
    }
}
