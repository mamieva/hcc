import { Routes } from '@angular/router';

import { ReceiptC2Component } from './receiptC2.component';

export const ReceiptC2Routes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: ReceiptC2Component
    }]
}
];
