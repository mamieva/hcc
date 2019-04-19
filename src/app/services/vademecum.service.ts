import { Injectable } from '@angular/core';

import { ApiClientService } from './util/api.client.service';

@Injectable()
export class VademecumService {
    constructor(private http: ApiClientService) { }

    getVademecum(id: number) {
        return this.http.get('/vademecum/' + id);
    }
    getPosologia() {
        return this.http.get('/secure/lookup/prescription/amount', { secure: false });
    }

    getAllVademecums(search: any, page: any, size: any) {
        return this.http.get('/vademecum?&search=' + search + '&page=' + page + '&size=' + size + '&sort=dateCreated,asc');
    }

    getVademecums(search: any, benefitType: any, vademecumTypeId: any) {
        return this.http.get('/vademecum/type?param=' + search + '&benefitType=' + benefitType + '&vademecumTypeId=' + vademecumTypeId);
        // return this.http.get('/secure/vademecum/param/' + search );
    }

    postVademecum(scheduleId: any, schedule: any) {
        return this.http.post('/vademecum/' + scheduleId, schedule);
    }

    endVademecum(id: number, vademecum: any) {
        return this.http.put('/endvademecum/' + id, vademecum);
    }

    cancelVademecum(id: number, vademecum: any) {
        return this.http.put('/cancelvademecum/' + id, vademecum);
    }

    deleteVademecum(id: number) {
        return this.http.delete('/vademecum/' + id);
    }

}