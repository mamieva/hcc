import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LbdTableComponent } from '../lbd/lbd-table/lbd-table.component';
import { MdDatepickerModule, MdInputModule, MdNativeDateModule, MdSelectModule, MdAutocompleteModule} from '@angular/material';

import { InterconsultComponent } from './interconsult.component';
import { InterconsultRoutes } from './interconsult.routing';
import { HealthCenterService } from '../services/health.center.service';

import { InterconsultSafeHtmlPipe } from '../services/pipes/interconsult.safe.html.pipe';
import { PersonService } from '../services/person.service';
import { CareserviceService } from '../services/careservice.service';
import { ScheduleService } from '../services/schedule.service';
import { PlanningService } from '../services/planning.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(InterconsultRoutes),
        FormsModule,
        ReactiveFormsModule,
        MdDatepickerModule,
        MdInputModule,
        MdNativeDateModule,
        MdSelectModule,
        MdAutocompleteModule
    ],
    declarations: [ InterconsultComponent, InterconsultSafeHtmlPipe ],
    providers: [ PersonService, ScheduleService, CareserviceService, PlanningService, HealthCenterService ]
})

export class InterconsultModule {}
