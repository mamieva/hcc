import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdDatepickerModule, MdInputModule, MdNativeDateModule, MdSelectModule, MdAutocompleteModule} from '@angular/material';

import { OperatorFormComponent } from './operator.form.component';
import { OperatorFormRoutes } from './operator.form.routing';
import { HealthCenterService } from '../../../services/health.center.service';
import { ProfileService } from '../../../services/profile.service';
import { PersonService } from '../../../services/person.service';
import { OperatorService } from '../../../services/operator.service';
import { CareserviceService } from '../../../services/careservice.service';
import { OperatorSafeHtmlPipe } from '../../../services/pipes/operator.safe.html.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(OperatorFormRoutes),
    FormsModule,
    ReactiveFormsModule,
    MdDatepickerModule,
    MdInputModule,
    MdNativeDateModule,
    MdSelectModule,
    MdAutocompleteModule
  ],
  declarations: [
    OperatorFormComponent,
    OperatorSafeHtmlPipe
  ],
  providers: [
    HealthCenterService,
    OperatorService,
    ProfileService,
    PersonService,
    CareserviceService
  ]
})

export class OperatorFormModule {}
