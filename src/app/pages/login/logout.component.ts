import { Component } from '@angular/core';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
    moduleId: module.id,
    template: ``
})

export class LogoutComponent {
    constructor(private authenticationService: AuthenticationService) {
        authenticationService.logout();
    }
}
