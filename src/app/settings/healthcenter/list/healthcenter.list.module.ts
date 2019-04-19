import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HealthcenterListComponent } from './healthcenter.list.component';
import { HealthcenterListRoutes } from './healthcenter.list.routing';
import { HealthCenterService } from '../../../services/health.center.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(HealthcenterListRoutes),
    FormsModule
  ],
  declarations: [
      HealthcenterListComponent
  ],
  providers: [
    HealthCenterService
  ]
})

export class HealthcenterListModule {}
