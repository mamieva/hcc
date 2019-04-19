import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdDatepickerModule, MdInputModule, MdNativeDateModule, MdSelectModule, MdAutocompleteModule } from '@angular/material';

import { ProfileFormComponent } from './profile.form.component';
import { ProfileFormRoutes } from './profile.form.routing';
import { HealthCenterService } from '../../../services/health.center.service';
import { PersonService } from '../../../services/person.service';
import { ProfileService } from '../../../services/profile.service';
import { ModuleService } from '../../../services/module.service';
import { CareserviceService } from '../../../services/careservice.service';
// import { ProfileSafeHtmlPipe } from '../../../services/pipes/profile.safe.html.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ProfileFormRoutes),
    FormsModule,
    ReactiveFormsModule,
    MdDatepickerModule,
    MdInputModule,
    MdNativeDateModule,
    MdSelectModule,
    MdAutocompleteModule
  ],
  declarations: [
    ProfileFormComponent,
    // ProfileSafeHtmlPipe
  ],
  providers: [
    HealthCenterService,
    ProfileService,
    PersonService,
    ModuleService,
    CareserviceService
  ]
})

export class ProfileFormModule {}
