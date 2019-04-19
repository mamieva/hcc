import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdDatepickerModule, MdInputModule, MdNativeDateModule, MdSelectModule, MdAutocompleteModule, MdIconModule, MdCheckbox, MdCheckboxModule } from '@angular/material';

import { SpecialityService } from '../../../services/speciality.service';

import { SpecialityFormComponent } from './speciality.form.component';
import { SpecialityFormRoutes } from './speciality.form.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SpecialityFormRoutes),
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
    SpecialityFormComponent
  ],
  providers: [
    SpecialityService
  ]
})

export class SpecialityFormModule {}
