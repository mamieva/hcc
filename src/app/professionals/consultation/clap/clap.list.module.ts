import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdDatepickerModule, MdInputModule, MdNativeDateModule, MdSelectModule, MdAutocompleteModule, MdIconModule, MdCheckbox, MdCheckboxModule } from '@angular/material';

import { ClapListComponent } from './clap.list.component';
import { ClapListRoutes } from './clap.list.routing';

import { PersonService } from '../../../services/person.service';
import { ConsultationService } from '../../../services/consultation.service';
import { OperatorService } from '../../../services/operator.service';
import { ClapSafeHtmlPipe } from '../../../services/pipes/clap.safe.html.pipe';

import { SafeHtmlPipe } from '../../../services/pipes/safe.html.pipe';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ClapListRoutes),
    FormsModule,
    MdDatepickerModule,
    MdInputModule,
    MdNativeDateModule,
    MdSelectModule,
    MdAutocompleteModule,
    MdIconModule,
    MdCheckboxModule,
  ],
  declarations: [
    ClapListComponent,
    ClapSafeHtmlPipe
  ],
  providers: [
    PersonService,
    OperatorService,
    ConsultationService
  ]
})

export class ClapListModule {}
