import { Injectable } from '@angular/core';

import { ApiClientService } from './util/api.client.service';

@Injectable()
export class CityService {
    constructor(private http: ApiClientService) {}

    getCities() {
        return this.http.get('/secure/citiesbystate/20', {secure: false});
    }
}