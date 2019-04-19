import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdDatepickerModule, MdInputModule, MdNativeDateModule, MdSelectModule, MdAutocompleteModule } from '@angular/material';

import { HealthcenterFormComponent } from './healthcenter.form.component';
import { HealthcenterFormRoutes } from './healthcenter.form.routing';

import { HealthCenterService } from '../../../services/health.center.service';
import { CityService } from '../../../services/city.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(HealthcenterFormRoutes),
    FormsModule,
    MdDatepickerModule,
    MdInputModule,
    MdNativeDateModule,
    MdSelectModule,
    MdAutocompleteModule
    
  ],
  declarations: [
      HealthcenterFormComponent
  ],
  providers: [
    HealthCenterService,
    CityService
  ]
})

export class HealthcenterFormModule {}
