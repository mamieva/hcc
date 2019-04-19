import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LbdTableComponent } from '../lbd/lbd-table/lbd-table.component';
import { MdDatepickerModule, MdInputModule, MdNativeDateModule, MdSelectModule, MdAutocompleteModule} from '@angular/material';

import { ScheduleComponent } from './schedule.component';
import { ScheduleRoutes } from './schedule.routing';

import { ScheduleSafeHtmlPipe } from '../services/pipes/schedule.safe.html.pipe';
import { PersonService } from '../services/person.service';
import { CareserviceService } from '../services/careservice.service';
import { ScheduleService } from '../services/schedule.service';
import { PlanningService } from '../services/planning.service';
import { HealthCenterService } from '../services/health.center.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ScheduleRoutes),
        FormsModule,
        ReactiveFormsModule,
        MdDatepickerModule,
        MdInputModule,
        MdNativeDateModule,
        MdSelectModule,
        MdAutocompleteModule
    ],
    declarations: [ ScheduleComponent, ScheduleSafeHtmlPipe ],
    providers: [ PersonService, ScheduleService, CareserviceService, PlanningService, HealthCenterService ]
})

export class ScheduleModule {}
