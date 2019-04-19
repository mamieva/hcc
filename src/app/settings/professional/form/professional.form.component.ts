import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ProfessionalService } from '../../../services/professional.service';
import { PersonService } from '../../../services/person.service';
import { SpecialityService } from '../../../services/speciality.service';
import { ProfileService } from '../../../services/profile.service';

declare const swal: any;

@Component({
    selector: 'professional-form-cmp',
    moduleId: module.id,
    templateUrl: 'professional.form.component.html'
})

export class ProfessionalFormComponent implements OnInit {
    title: string = "Nuevo Profesional";
    model: any = {};
    id: number;
    person: any;
    documentNumber: string;
    sex: string;
    specialities: any[];
    currentSpecialities: any[] = [];
    profiles : any[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private professionalService: ProfessionalService,
        private profileService: ProfileService,
        private personService: PersonService,
        private specialityService: SpecialityService
    ) {
        this.route.params.subscribe(params => {
            this.id = +params.id;
        });
        specialityService.getSpecialities().subscribe((response: any) => {
            this.specialities = response;
        });
        //Obtener Perfiles
        this.profileService.getAllProfilesProfessional().subscribe((response: any) => {
            // this.cdr.detectChanges();
            this.profiles = Array.from(response);
            // console.log('perfiles', this.profiles);
        });
        if (this.id) {
            this.title = "Modificar Profesional";
            professionalService.getProfessional(this.id).subscribe(response => {
                this.model = response;
                this.person = this.model.person;
                this.model.phone = this.person.phone;
                this.model.email = this.person.email;
                this.model.status = (this.model.status == 'ACT' ? true : false);
                this.currentSpecialities = [];
                for (let s of this.model.professionalhasspecialties) {
                    this.currentSpecialities.push(s.specialty.id);
                }
                // console.log(this.model);
            });
        }
        else {
            this.model = {
                person: {
                }
            };
        }
        
    }

    ngOnInit() {
        document.querySelector('#top').scrollIntoView({ behavior: 'smooth' });
    }

    findPerson() {
        this.personService.getByDocumentAndSex(this.documentNumber, this.sex).subscribe(
            response => {
                this.person = response;
                if (this.person) {
                    this.model.person = this.person;
                    this.model.phone = this.person.phone;
                    this.model.email = this.person.email;
                    this.model.profile = {};
                }
                else {
                    swal({
                        title: 'Verifique datos de la persona',
                        animation: false,
                        customClass: 'animated tada',
                        confirmButtonColor: '#f44336'
                      });
                }
            },
            error => {
                swal({
                    title: 'Verifique datos de la persona',
                    animation: false,
                    customClass: 'animated tada',
                    confirmButtonColor: '#f44336'
                  });
            }
        );
    }

    closePerson() {
        this.person = null;
        this.documentNumber = '';
        this.sex = '';
    }

    private findSpeciality(id: number) {
        for (let s of this.specialities) {
            if (s.id == id) {
                return s;
            }
        }
        return null;
    }

    private dialog(msg: string) {
        swal({
            title: msg,
            animation: false,
            customClass: 'animated tada',
            confirmButtonColor: '#f44336'
          });
    }

    onSubmit() {
        this.model.status = this.model.status ? 'ACT' : 'BAJ';
        this.model.person = {
            id: this.model.person.id,
            phone: this.model.phone,
            email: this.model.email
        };
        this.model.professionalhasspecialties = [];
        let speciality: any;
        for (let s of this.currentSpecialities) {
            speciality = this.findSpeciality(s);
            if (speciality) {
                this.model.professionalhasspecialties.push({
                    specialty: speciality
                });
            }
        }
        // console.log(this.model);
        this.professionalService.saveProfessional(this.model).subscribe(response => {
            this.router.navigateByUrl('/professionallist');
        },
        error => {
            let body: any = JSON.parse(error._body);
            let msg: string = body && body.message ? body.message : 'Ocurrió un error al intentar crear Profesional';
            this.dialog(msg);
        });
    }
    cancelSubmit() {
        this.router.navigateByUrl('professionallist');
    }
}
