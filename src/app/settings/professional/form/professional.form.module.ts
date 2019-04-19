import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProfileService } from '../../../services/profile.service';
import { MdDatepickerModule, MdInputModule, MdNativeDateModule, MdSelectModule, MdAutocompleteModule } from '@angular/material';

import { ProfessionalFormComponent } from './professional.form.component';
import { ProfessionalFormRoutes } from './professional.form.routing';

import { ProfessionalSafeHtmlPipe } from '../../../services/pipes/professional.safe.html.pipe';
import { PersonService } from '../../../services/person.service';
import { ProfessionalService } from '../../../services/professional.service';
import { SpecialityService } from '../../../services/speciality.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ProfessionalFormRoutes),
    FormsModule,
    MdDatepickerModule,
    MdInputModule,
    MdNativeDateModule,
    MdSelectModule,
    MdAutocompleteModule
  ],
  declarations: [
    ProfessionalFormComponent,
    ProfessionalSafeHtmlPipe
  ],
  providers: [
    PersonService,
    ProfessionalService,
    SpecialityService,
    ProfileService
  ]
})

export class ProfessionalFormModule {}
