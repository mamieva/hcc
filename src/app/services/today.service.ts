import { Injectable } from '@angular/core';

import { ApiClientService } from './util/api.client.service';

@Injectable()
export class TodayService {
    constructor(private http: ApiClientService) {}

    getToday(search: string) {
        return this.http.get('/schedule/today?search=' + search);
    }

    putArrival(id: number) {
        return this.http.put('/arrival/' + id, {});
    }
    putArrivalInterconsultation(id: number) {
        return this.http.put('/arrival/' + id + '/telemedicine', {});
    }
}