import { Injectable } from '@angular/core';

import { ApiClientService } from './util/api.client.service';

@Injectable()
export class ModuleService {
    constructor(private http: ApiClientService) {}

    getModule(id: number) {
        return this.http.get('/secure/module/' + id, {secure: false});
    }

    getAllModules() {
        return this.http.get('/secure/module?search=', {secure: false});
    }

    postModule(module: any) {
        return this.http.post('/secure/module', module, {secure: false});
    }

    putModule(id: number, module: any) {
        return this.http.put('/secure/module/' + id, module, {secure: false});
    }

    deleteModule(id: number) {
        return this.http.delete('/secure/module/' + id, {secure: false});
    }
}