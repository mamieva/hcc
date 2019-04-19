import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { ApiClientService } from './util/api.client.service';

@Injectable()
export class HealthCenterService {
    constructor(private http: ApiClientService) {}

    getHealthCenter(id: number) {
        return this.http.get('/healthCenter/' + id);
    }

    getAllHealthCenters() {
        return this.http.get('/healthCenter/all');
    }

    saveHealthCenter(center: any) {
        return center.id ? this.putHealthCenter(center.id, center) : this.postHealthCenter(center);
    }

    deleteHealthCenter(id: number) {
        return this.http.delete('/healthCenter/' + id);
    }

    private postHealthCenter(center: any) {
        return this.http.post('/healthCenter', center);
    }

    private putHealthCenter(id: number, center: any) {
        return this.http.put('/healthCenter', center);
    }
}