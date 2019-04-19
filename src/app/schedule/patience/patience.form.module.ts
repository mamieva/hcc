import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PatienceFormComponent } from './patience.form.component';
import { PatienceFormRoutes } from './patience.form.routing';

import { PersonService } from '../../services/person.service';
import { HealthCenterService } from '../../services/health.center.service';
// import { PatienceSafeHtmlPipe } from '../../services/pipes/patience.safe.html.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PatienceFormRoutes),
    FormsModule
  ],
  declarations: [
    PatienceFormComponent,
    // PatienceSafeHtmlPipe
  ],
  providers: [
    PersonService,
    HealthCenterService
  ]
})

export class PatienceFormModule {}
