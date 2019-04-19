import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlanningListComponent } from './planning.list.component';
import { PlanningListRoutes } from './planning.list.routing';

import { PlanningService } from '../../../services/planning.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PlanningListRoutes),
    FormsModule
  ],
  declarations: [
    PlanningListComponent
  ],
  providers: [
    PlanningService
  ]
})

export class PlanningListModule {}
