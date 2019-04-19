import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { SafeHtmlPipe } from '../services/pipes/safe.html.pipe';
//import { OperatorService } from '../services/operator.service';

@NgModule({
    imports: [ RouterModule, CommonModule ],
    declarations: [ SidebarComponent, SafeHtmlPipe],
    //providers: [OperatorService],
    exports: [ SidebarComponent]
})

export class SidebarModule {}
