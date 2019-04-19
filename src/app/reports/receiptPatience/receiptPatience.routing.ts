import { Routes } from '@angular/router';

import { ReceiptPatienceComponent } from './receiptPatience.component';

export const ReceiptPatienceRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: ReceiptPatienceComponent
    }]
}
];
