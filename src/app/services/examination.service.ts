import { Injectable } from '@angular/core';

import { ApiClientService } from './util/api.client.service';

@Injectable()
export class ExaminationService {
    constructor(private http: ApiClientService) {}

    // http://localhost:8080/secure/examinationType/{id}    GET
    // http://localhost:8080/secure/examinationType          GET
    // http://localhost:8080/secure/examinationType          POST
    // http://localhost:8080/secure/examinationType          PUT
    // http://localhost:8080/secure/examinationType/{id}    DELETE
    
    // http://localhost:8080/secure/examinationItem/{id}    GET
    // http://localhost:8080/secure/examinationItem          GET
    // http://localhost:8080/secure/examinationItem          POST
    // http://localhost:8080/secure/examinationItem          PUT
    // http://localhost:8080/secure/examinationItem/{id}    DELETE
    //http://localhost:8080/secure/examinationItem/specialty/1  GET ITEMS BY SPECIALTY

    getExaminationType(id: number) {
        return this.http.get('/secure/examinationType/' + id);
    }

    getAllExaminationType() {
        return this.http.get('/secure/examinationType');
    }

    getExaminationsType(search: any) {
        return this.http.get('/secure/examinationType/name/' + search );
        // return this.http.get('/secure/examination/param/' + search );
    }

    postExaminationType(id: any,examination : any) {
        return this.http.post('/secure/examinationType/'+ id, examination);
    }

    putExaminationType(id: number, examination: any) {
        return this.http.put('/secure/examinationType/' + id, examination);
    }

    deleteExaminationType(id: number) {
        return this.http.delete('/secure/examinationType/' + id);
    }

    //
    
    getExaminationItem(id: number) {
        return this.http.get('/secure/examinationItem/' + id);
    }

    getAllExaminationsItem() {
        return this.http.get('/secure/examinationItem');
    }

    getExaminationsItem(search: any) {
        return this.http.get('/secure/examinationItem/type?search=' + search );
        // return this.http.get('/secure/examination/param/' + search );
    }
    getExaminationsItemBySpecialty(specialtyId: any) {
        return this.http.get('/secure/examinationItem/specialty/' + specialtyId );
        // return this.http.get('/secure/examination/param/' + search );
    }
    getExaminationsItemByService(serviceId: any) {
        return this.http.get('/secure/examinationItem/service/' + serviceId, { secure: false });
        // return this.http.get('/secure/examination/param/' + search );
    }

    postExaminationItem(id: any,examination : any) {
        return this.http.post('/secure/examinationItem/'+ id, examination);
    }

    putExaminationItem(id: number, examination: any) {
        return this.http.put('/secure/examinationItem/' + id, examination);
    }

    deleteExaminationItem(id: number) {
        return this.http.delete('/secure/examinationItem/' + id);
    }
}