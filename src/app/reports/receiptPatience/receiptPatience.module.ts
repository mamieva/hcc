import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdDatepickerModule, MdInputModule, MdNativeDateModule, MdSelectModule, MdAutocompleteModule} from '@angular/material';

import { ReceiptPatienceComponent } from './receiptPatience.component';
import { ReceiptPatienceRoutes } from './receiptPatience.routing';

// import { ReceiptSafeHtmlPipe } from '../services/pipes/receipt.safe.html.pipe';
import { PersonService } from '../../services/person.service';
import { ReportsService } from '../../services/reports.service';
// import { ReceiptService } from '../services/receipt.service';
import { ScheduleService } from '../../services/schedule.service';
import { ProfessionalService } from '../../services/professional.service';
import { CareserviceService } from '../../services/careservice.service';
import { ReportsPatienceSafeHtmlPipe } from '../../services/pipes/reportsPatience.safe.html.pipe';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ReceiptPatienceRoutes),
    FormsModule,
    ReactiveFormsModule,
    MdDatepickerModule,
    MdInputModule,
    MdNativeDateModule,
    MdSelectModule,
    MdAutocompleteModule
  ],
  declarations: [
      ReceiptPatienceComponent,
      ReportsPatienceSafeHtmlPipe
  ],
  providers: [
    ReportsService,
    PersonService,
    ProfessionalService,
    ScheduleService,
    CareserviceService
  ]
})

export class ReceiptPatienceModule {}
