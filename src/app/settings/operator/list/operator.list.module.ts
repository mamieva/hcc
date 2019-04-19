import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OperatorListComponent } from './operator.list.component';
import { OperatorListRoutes } from './operator.list.routing';

import { OperatorService } from '../../../services/operator.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(OperatorListRoutes),
    FormsModule
  ],
  declarations: [
    OperatorListComponent
  ],
  providers: [
    OperatorService
  ]
})

export class OperatorListModule {}
