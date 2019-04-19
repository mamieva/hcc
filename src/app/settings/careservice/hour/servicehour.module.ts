import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MdDatepickerModule, MdInputModule, MdNativeDateModule, MdSelectModule, MdAutocompleteModule,MdSnackBar, MdSnackBarModule} from '@angular/material';
import { DatepickerModule } from 'angular2-material-datepicker';
import { NouisliderModule } from 'ng2-nouislider';
import { TagInputModule } from 'ngx-chips';

import { ServicehourComponent } from './servicehour.component';
import { ServicehourRoutes } from './servicehour.routing';
import { PlanningService } from '../../../services/planning.service';
import { ProfessionalService } from '../../../services/professional.service';
import { CareserviceService } from '../../../services/careservice.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ServicehourRoutes),
    FormsModule,
    ReactiveFormsModule,
    NouisliderModule,
    TagInputModule,
    MdDatepickerModule,
    MdInputModule,
    MdNativeDateModule,
    MdAutocompleteModule,
    MdSelectModule,
    DatepickerModule,
    MdSnackBarModule
  ],
  declarations: [
      ServicehourComponent
  ],
  providers: [
    PlanningService,
    ProfessionalService,
    CareserviceService
  ]
})

export class ServicehourModule {}
