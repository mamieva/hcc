import { NgModule,LOCALE_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdDatepickerModule, MdInputModule, MdNativeDateModule, MdSelectModule, MdAutocompleteModule, MdIconModule, MdCheckbox, MdCheckboxModule } from '@angular/material';


import { PatienceFormComponent } from './patience.form.component';
import { PatienceFormRoutes } from './patience.form.routing';
import { ConsultationService } from '../../services/consultation.service';

import { PersonService } from '../../services/person.service';
import { OperatorService } from '../../services/operator.service';
import { HealthCenterService } from '../../services/health.center.service';
import { PatienceSafeHtmlPipe } from '../../services/pipes/patience.safe.html.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PatienceFormRoutes),
    FormsModule,
    ReactiveFormsModule,
    MdDatepickerModule,
    MdInputModule,
    MdNativeDateModule,
    MdSelectModule,
    MdAutocompleteModule,
    MdIconModule,
    MdCheckboxModule
  ],
  declarations: [
    PatienceFormComponent,
    PatienceSafeHtmlPipe
  ],
  providers: [
    PersonService,
    HealthCenterService,
    ConsultationService,
    { provide: LOCALE_ID, useValue: "es-ES" }
  ]
})

export class PatienceFormModule {}
