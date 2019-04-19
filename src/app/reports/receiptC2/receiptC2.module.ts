import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdDatepickerModule, MdInputModule, MdNativeDateModule, MdSelectModule, MdAutocompleteModule} from '@angular/material';

import { ReceiptC2Component } from './receiptC2.component';
import { ReceiptC2Routes } from './receiptC2.routing';

// import { ReceiptSafeHtmlPipe } from '../services/pipes/receipt.safe.html.pipe';
import { PersonService } from '../../services/person.service';
import { ReportsService } from '../../services/reports.service';
// import { ReceiptService } from '../services/receipt.service';
import { ScheduleService } from '../../services/schedule.service';
import { ProfessionalService } from '../../services/professional.service';
import { CareserviceService } from '../../services/careservice.service';
import { ReportsC2SafeHtmlPipe } from '../../services/pipes/reportsC2.safe.html.pipe';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ReceiptC2Routes),
    FormsModule,
    ReactiveFormsModule,
    MdDatepickerModule,
    MdInputModule,
    MdNativeDateModule,
    MdSelectModule,
    MdAutocompleteModule
  ],
  declarations: [
      ReceiptC2Component,
      ReportsC2SafeHtmlPipe
  ],
  providers: [
    ReportsService,
    PersonService,
    ProfessionalService,
    ScheduleService,
    CareserviceService
  ]
})

export class ReceiptC2Module {}
