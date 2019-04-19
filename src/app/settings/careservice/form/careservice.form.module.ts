import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdDatepickerModule, MdInputModule, MdNativeDateModule, MdSelectModule, MdAutocompleteModule, MdIconModule, MdCheckbox, MdCheckboxModule } from '@angular/material';

import { SpecialityService } from '../../../services/speciality.service';

import { CareserviceFormComponent } from './careservice.form.component';
import { CareserviceFormRoutes } from './careservice.form.routing';

import { CareserviceService } from '../../../services/careservice.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CareserviceFormRoutes),
    ReactiveFormsModule,
    FormsModule,
    MdDatepickerModule,
    MdInputModule,
    MdNativeDateModule,
    MdSelectModule,
    MdAutocompleteModule,
    MdIconModule,
    MdCheckboxModule
  ],
  declarations: [
    CareserviceFormComponent
  ],
  providers: [
    CareserviceService,
    SpecialityService    
  ]
})

export class CareserviceFormModule {}
