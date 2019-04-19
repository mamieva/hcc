import { Component } from '@angular/core';

declare var require: any;

const { version: appVersion } = require('../../../../package.json');

import { AppService } from '../../services/app.service';

@Component({
    selector: 'app-footer-cmp',
    templateUrl: 'footer.component.html'
})

export class FooterComponent {
    test: Date = new Date();
    appVersion: string;
    apiVersion: string;

    constructor(appService: AppService) {
        this.appVersion = appVersion;
        this.apiVersion = sessionStorage.getItem('apiVersion');
        if (!this.apiVersion) {
            appService.getVersion().subscribe((response: any) => {
                this.apiVersion = response.appVersion;
                sessionStorage.setItem('apiVersion', this.apiVersion);
            });
        }
    }
}
