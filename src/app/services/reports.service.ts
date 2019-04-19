import { Injectable } from '@angular/core';

import { ApiClientService } from './util/api.client.service';

@Injectable()
export class ReportsService {
    constructor(private http: ApiClientService) { }

    getAttention(date: any, professional: any) {
        return this.http.get('/secure/reporting/pdf/attention?healthCenterId=' + this.http.getHealthCenterId() + '&date=' + date + '&professionals=' + professional, { secure: false });
    }
    getReportC2(serviceId: any, month: any, year: any) {
        return this.http.get('/secure/reporting/pdf/summary?healthCenterId=' + this.http.getHealthCenterId() + '&serviceId=' + serviceId + '&month=' + month + '&year=' + year, { secure: false });
    }
    getReportC2Services(serviceId: any, month: any, year: any) {
        return this.http.get('/secure/reporting/pdf/summary?healthCenterId=' + this.http.getHealthCenterId() + '&specialties=' + serviceId + '&month=' + month + '&year=' + year, { secure: false });
    }
    getReportSchedule(serviceId: any, day:any) {
        return this.http.get('/secure/reporting/pdf/schedules?healthCenterId=' + this.http.getHealthCenterId() + '&serviceId=' + serviceId + '&date=' + day, { secure: false });
    }
    getReportPatience(personId: any) {
        return this.http.get('/secure/reporting/pdf/schedules/person?healthCenterId=' + this.http.getHealthCenterId() + '&personId=' + personId, { secure: false });
    }
}