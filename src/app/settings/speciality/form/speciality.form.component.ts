import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, LOCALE_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { SpecialityService } from '../../../services/speciality.service';

declare const swal: any;

@Component({
    selector: 'speciality-form-cmp',
    moduleId: module.id,
    templateUrl: 'speciality.form.component.html'
})

export class SpecialityFormComponent implements OnInit {
    title: string = "Nueva Especialidad";
    model: any = {};
    id: number;
    
    constructor(private route: ActivatedRoute, private router: Router, private specialityService: SpecialityService) {
        this.route.params.subscribe(params => {
            this.id = +params.id;
        });
        if (this.id) {
            this.title = "Modificar Especialidad";
            specialityService.getSpeciality(this.id).subscribe(response => {
                this.model = response;
                // console.log(this.model);
            });        
        }
    }

    ngOnInit() {
        document.querySelector('#top').scrollIntoView({ behavior: 'smooth' });
    }

    dialog(msg: string) {
        swal({
            title: msg,
            animation: false,
            customClass: 'animated tada',
            confirmButtonColor: '#f44336'
        });
    }

    exists(list: any[], name: string) {
        for (let l of list) {
            if (l.name == name) {
                return true;
            }
        }
        return false;
    }

    onSubmit() {
        // console.log(this.model);
        this.specialityService.getSpecialities().subscribe((response: any) => {
            let list: any[] = response;
            // console.log(list);
            if (this.exists(list, this.model.name)) {
                this.dialog('La especialidad: ' + this.model.name + ', ya existe.');
            }
            else {
                this.specialityService.saveSpeciality(this.model).subscribe(response => {
                    this.router.navigateByUrl('/specialitylist');
                });
            }
        });
    }
    cancelSubmit() {
        this.router.navigateByUrl('specialitylist');
    }
    
}
