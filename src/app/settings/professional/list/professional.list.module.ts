import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProfessionalListComponent } from './professional.list.component';
import { ProfessionalListRoutes } from './professional.list.routing';

import { ProfessionalService } from '../../../services/professional.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ProfessionalListRoutes),
    FormsModule
  ],
  declarations: [
    ProfessionalListComponent
  ],
  providers: [
    ProfessionalService
  ]
})

export class ProfessionalListModule {}
