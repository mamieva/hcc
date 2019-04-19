import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdDatepickerModule, MdInputModule, MdNativeDateModule, MdSelectModule, MdAutocompleteModule} from '@angular/material';

import { ReceiptScheduleComponent } from './receiptSchedule.component';
import { ReceiptScheduleRoutes } from './receiptSchedule.routing';

// import { ReceiptSafeHtmlPipe } from '../services/pipes/receipt.safe.html.pipe';
import { PersonService } from '../../services/person.service';
import { ReportsService } from '../../services/reports.service';
// import { ReceiptService } from '../services/receipt.service';
import { ScheduleService } from '../../services/schedule.service';
import { ProfessionalService } from '../../services/professional.service';
import { CareserviceService } from '../../services/careservice.service';
import { ReportsScheduleSafeHtmlPipe } from '../../services/pipes/reportsSchedule.safe.html.pipe';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ReceiptScheduleRoutes),
    FormsModule,
    ReactiveFormsModule,
    MdDatepickerModule,
    MdInputModule,
    MdNativeDateModule,
    MdSelectModule,
    MdAutocompleteModule
  ],
  declarations: [
      ReceiptScheduleComponent,
      ReportsScheduleSafeHtmlPipe
  ],
  providers: [
    ReportsService,
    PersonService,
    ProfessionalService,
    ScheduleService,
    CareserviceService
  ]
})

export class ReceiptScheduleModule {}
