import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CareserviceListComponent } from './careservice.list.component';
import { CareserviceListRoutes } from './careservice.list.routing';
import { CareserviceService } from '../../../services/careservice.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CareserviceListRoutes),
    FormsModule
  ],
  declarations: [
      CareserviceListComponent
  ],
  providers: [
    CareserviceService
  ]
})

export class CareserviceListModule {}
