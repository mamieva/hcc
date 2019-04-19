import { NgModule, LOCALE_ID  } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdDatepickerModule, MdInputModule, MdNativeDateModule, MdSelectModule, MdAutocompleteModule, MdIconModule, MdCheckbox, MdCheckboxModule } from '@angular/material';

import { ConsultationFormComponent } from './consultation.form.component';
import { ConsultationFormRoutes } from './consultation.form.routing';

import { ConsultationSafeHtmlPipe } from '../../../services/pipes/consultation.safe.html.pipe';
import { PersonService } from '../../../services/person.service';
import { ScheduleService } from '../../../services/schedule.service';
import { ConsultationService } from '../../../services/consultation.service';
import { SpecialityService } from '../../../services/speciality.service';
import { VademecumService } from '../../../services/vademecum.service';
import { ExaminationService } from '../../../services/examination.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ConsultationFormRoutes),
    ReactiveFormsModule,
    FormsModule,
    MdDatepickerModule,
    MdInputModule,
    MdNativeDateModule,
    MdSelectModule,
    MdAutocompleteModule,
    MdIconModule,
    MdCheckboxModule,
  ],
  declarations: [
    ConsultationFormComponent,
    ConsultationSafeHtmlPipe
  ],
  providers: [
    ScheduleService,
    PersonService,
    ConsultationService,
    SpecialityService,
    VademecumService,
    ExaminationService,
    { provide: LOCALE_ID, useValue: "es-ES" }
  ]
})

export class ConsultationFormModule {}
