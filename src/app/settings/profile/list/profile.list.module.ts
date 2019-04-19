import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProfileListComponent } from './profile.list.component';
import { ProfileListRoutes } from './profile.list.routing';

import { ProfileService } from '../../../services/profile.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ProfileListRoutes),
    FormsModule
  ],
  declarations: [
    ProfileListComponent
  ],
  providers: [
    ProfileService
  ]
})

export class ProfileListModule {}
