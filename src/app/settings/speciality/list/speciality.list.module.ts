import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SpecialityService } from '../../../services/speciality.service';

import { SpecialityListComponent } from './speciality.list.component';
import { SpecialityListRoutes } from './speciality.list.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SpecialityListRoutes),
    FormsModule
  ],
  declarations: [
    SpecialityListComponent
  ],
  providers: [
    SpecialityService
  ]
})

export class SpecialityListModule {}
