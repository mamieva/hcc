import { Injectable } from '@angular/core';

import { ApiClientService } from './util/api.client.service';

@Injectable()
export class ProfessionalService {
    constructor(private http: ApiClientService) {}

    getProfessional(id: number) {
        return this.http.get('/professional/' + id);
    }

    getAllProfessionals() {
        return this.http.get('/professional?search=');
    }

    getAllProfessionalsAct(search: string) {
        return this.http.get('/professional?search='+ search + '&status=ACT');
    }

    getProfessionals(search: string, page: any, size:any) {
        return this.http.get('/professional?search=' + search  + '&page=' + page + '&size=' + size + '&sort=dateCreated,asc');
    }

    saveProfessional(model: any) {
        if (model.id) {
            return this.putProfessional(model);
        }
        else {
            return this.postProfessional(model);
        }
    }

    deleteProfessional(id: number) {
        return this.http.delete('/professional/' + id);
    }

    private postProfessional(model: any) {
        return this.http.post('/professional', model);
    }

    private putProfessional(model: any) {
        return this.http.put('/professional/' + model.id, model);
    }
}