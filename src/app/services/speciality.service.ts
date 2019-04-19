import { Injectable } from '@angular/core';

import { ApiClientService } from './util/api.client.service';

@Injectable()
export class SpecialityService {
    constructor(private http: ApiClientService) { }

    getSpeciality(id: number) {
        return this.http.get('/secure/specialty/' + id, { secure: false });
    }

    saveSpeciality(model: any) {
        if (model.id) {
            return this.putSpeciality(model.id, model);
        }
        else {
            return this.postSpeciality(model);
        }
    }

    postSpeciality(model: any) {
        return this.http.post('/secure/specialty', model, { secure: false });
    }

    putSpeciality(id: number, model: any) {
        return this.http.put('/secure/specialty/' + id, model, { secure: false });
    }

    getSpecialities() {
        return this.http.get('/secure/specialty', { secure: false });
    }
    getAllSpecialties(search: any) {
        return this.http.get('/secure/specialty/search?search=' + search, { secure: false });;
    }

    specialtyType(id: any, type: any) {
        // this.http.get('/secure/specialty/' + id + '/type/' + type).subscribe((response)=>{
        //     // console.log(response);
        // })
        return;
    }
}