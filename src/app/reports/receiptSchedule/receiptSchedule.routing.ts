import { Routes } from '@angular/router';

import { ReceiptScheduleComponent } from './receiptSchedule.component';

export const ReceiptScheduleRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: ReceiptScheduleComponent
    }]
}
];
