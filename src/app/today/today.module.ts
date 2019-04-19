import { NgModule, LOCALE_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MdDatepickerModule, MdInputModule, MdNativeDateModule, MdSelectModule, MdAutocompleteModule} from '@angular/material';

import { TodayComponent } from './today.component';
import { TodayRoutes } from './today.routing';

import { TodaySafeHtmlPipe } from '../services/pipes/today.safe.html.pipe';
import { PersonService } from '../services/person.service';
import { TodayService } from '../services/today.service';
import { OperatorService } from '../services/operator.service';
import { ScheduleService } from '../services/schedule.service';
import { CareserviceService } from '../services/careservice.service';
import { SpecialityService } from '../services/speciality.service';
import { PlanningService } from '../services/planning.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(TodayRoutes),
    FormsModule,
    ReactiveFormsModule,
    MdDatepickerModule,
    MdInputModule,
    MdNativeDateModule,
    MdSelectModule,
    MdAutocompleteModule
  ],
  declarations: [
      TodayComponent,
      TodaySafeHtmlPipe
  ],
  providers: [
    TodayService,
    PersonService,
    CareserviceService,
    ScheduleService,
    SpecialityService,
    PlanningService,
    OperatorService,
    { provide: LOCALE_ID, useValue: "es-ES" }
  ]
})

export class TodayModule {}
