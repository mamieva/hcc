import { Injectable } from '@angular/core';

import { ApiClientService } from './util/api.client.service';

@Injectable()
export class CareserviceService {
    constructor(private http: ApiClientService) { }

    getAllCareservices() {
        return this.http.get('/services/all?search=&includeInterconsultation=true');
    }
    getAllCareservicesSearch(search: any, page: any, size: any) {
        return this.http.get('/services/all?includeInterconsultation=true&search=' + search + '&page=' + page + '&size=' + size + '&sort=dateCreated,asc');
    }

    getActiveCareservices(includeInterconsultation: any) {
        return this.http.get('/services/ACT?search=&includeInterconsultation=' + includeInterconsultation);
    }
    getAllSpecialties(search:any){
        return this.http.get('/specialty?search=' + search);
    }

    getAllInterConsultCareservices() {
        return this.http.get('/services/interConsultation');
    }

    getService(id: number) {
        return this.http.get('/service/' + id);
    }
    deleteService(id: number) {
        return this.http.delete('/service/' + id);
    }

    getServicesByName(serviceName: string, includeInterconsultation: any) {
        return this.http.get('/services/search?includeInterconsultation=' + includeInterconsultation + '&name=' + serviceName);
    }
    getServicesInterConsultByName(serviceName: string) {
        return this.http.get('/services/interConsultation/search?name=' + serviceName);
    }

    postService(model: any) {
        return this.http.post('/service', model);
    }

    putService(id: number, model: any) {
        return this.http.put('/service/' + id, model);
    }

    getServiceByProfessionalHC(personId: number, hc: number) {
        return this.http.get('/services/person/healthcenter/' + personId + '/' + hc);
    }

    planningCareservice(plan: any, isValidate: any) {
        return this.http.post('/planning?isValidate=' + isValidate, plan)
    }
}