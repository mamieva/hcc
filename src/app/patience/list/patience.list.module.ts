import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PatienceListComponent } from './patience.list.component';
import { PatienceListRoutes } from './patience.list.routing';

import { PersonService } from '../../services/person.service';
import { CareserviceService } from '../../services/careservice.service';
import { ScheduleService } from '../../services/schedule.service';
import { OperatorService } from '../../services/operator.service';
import { Patience2SafeHtmlPipe } from '../../services/pipes/patience2.safe.html.pipe';

import { SafeHtmlPipe } from '../../services/pipes/safe.html.pipe';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PatienceListRoutes),
    FormsModule
  ],
  declarations: [
    PatienceListComponent,
    Patience2SafeHtmlPipe
  ],
  providers: [
    PersonService,
    OperatorService,
    CareserviceService,
    ScheduleService
  ]
})

export class PatienceListModule {}
