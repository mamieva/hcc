import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';

import { ApiClientService } from './util/api.client.service';

import { AppSettings } from '../app.settings';

@Injectable()
export class PersonService {
    constructor(private http: ApiClientService) { }

    getByDocumentAndSex(documentNumber: string, sex: string) {
        return this.http.get('/secure/person/data/' + documentNumber + '/' + sex, { secure: false });
    }
    getByDocumentSex(documentNumberSex: any) {
        return this.http.get('/secure/person/data/' + documentNumberSex, { secure: false });
    }
    getAllPerson() {
        return this.http.get('/secure/persons', { secure: false });
    }
    getAllPersonBySearch(search: any) {
        return this.http.get('/secure/person?search=' + search, { secure: false });
    }
    getCountry() {
        return this.http.get('/secure/country', { secure: false });
    }

    postPerson(person: any) {
        return this.http.post('/secure/person/', person, { secure: false });
    }

    savePerson(person: any) {
        return this.http.put('/secure/person/' + person.id, person, { secure: false });
    }
    getInterconsultationPatience(docNumber: any, sex: any) {
        return this.http.get('/interconsultationRequest/person/docNumber/' + docNumber + '/sex/' + sex);
    }
    postInterconsultationPatience(object: any) {
        return this.http.post('/interconsultationRequest/', object);
    }
}