import { Injectable } from '@angular/core';

import { ApiClientService } from './util/api.client.service';

@Injectable()
export class ProfileService {
    constructor(private http: ApiClientService) {}

    getProfile(id: number) {
        return this.http.get('/profile/' + id);
    }

    getAllProfiles() {
        return this.http.get('/profiles?search=');
    }
    
    getAllProfilesnoOperator(){
        return this.http.get('/profiles?professional=0');
    }
    getAllProfilesProfessional(){
        return this.http.get('/profiles?professional=1');
    }

    postProfile(profile: any) {
        profile.healthcenter = {};
        profile.healthcenter.id = this.http.getHealthCenterId();
        return this.http.post('/profile', profile);
    }

    putProfile(id: number, profile: any) {
        return this.http.put('/profile/' + id, profile);
    }

    deleteProfile(id: number) {
        return this.http.delete('/profile/' + id);
    }
}