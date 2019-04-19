import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConsultationListComponent } from './consultation.list.component';
import { ConsultationListRoutes } from './consultation.list.routing';

import { ConsultationService } from '../../../services/consultation.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ConsultationListRoutes),
    FormsModule
  ],
  declarations: [
    ConsultationListComponent
  ],
  providers: [
    ConsultationService
  ]
})

export class ConsultationListModule {}
