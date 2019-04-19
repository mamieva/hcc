import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdDatepickerModule, MdInputModule, MdNativeDateModule, MdSelectModule, MdAutocompleteModule} from '@angular/material';

import { ReceiptComponent } from './receipt.component';
import { ReceiptRoutes } from './receipt.routing';

// import { ReceiptSafeHtmlPipe } from '../services/pipes/receipt.safe.html.pipe';
import { PersonService } from '../../services/person.service';
import { ReportsService } from '../../services/reports.service';
// import { ReceiptService } from '../services/receipt.service';
import { ScheduleService } from '../../services/schedule.service';
import { ProfessionalService } from '../../services/professional.service';
import { ReportsSafeHtmlPipe } from '../../services/pipes/reports.safe.html.pipe';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ReceiptRoutes),
    FormsModule,
    ReactiveFormsModule,
    MdDatepickerModule,
    MdInputModule,
    MdNativeDateModule,
    MdSelectModule,
    MdAutocompleteModule
  ],
  declarations: [
      ReceiptComponent,
      ReportsSafeHtmlPipe
  ],
  providers: [
    ReportsService,
    PersonService,
    ProfessionalService,
    ScheduleService
  ]
})

export class ReceiptModule {}
