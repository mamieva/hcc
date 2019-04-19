import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApiClientService } from './util/api.client.service';

@Injectable()
export class ConsultationService {
    constructor(private http: ApiClientService) { }

    getConsultation(id: number) {
        return this.http.get('/consultation/' + id);
    }

    getAllConsultations(search: any, page: any, size: any) {
        return this.http.get('/consultation?&search=' + search + '&page=' + page + '&size=' + size + '&sort=dateCreated,asc');
    }

    postConsultation(scheduleId: any, schedule: any) {
        return this.http.post('/consultation/' + scheduleId, schedule);
    }

    endConsultation(id: number, consultation: any) {
        return this.http.put('/endconsultation/' + id, consultation);
    }

    cancelConsultation(id: number, consultation: any) {
        return this.http.put('/cancelconsultation/' + id, consultation);
    }

    deleteConsultation(id: number) {
        return this.http.delete('/consultation/' + id, { secure: false });
    }

    getDiagnosis(description: any) {
        return this.http.get('/diagnosisNomenclature/page/' + description, { secure: false });
    }
    getSummaryPerson(id: any) {
        return this.http.get('/consultation/summary/person/' + id)
    }
    downloadFile(id: any) {
        return this.http.get('/secure/files/download/pdf/consultation/' + id, { secure: false })
    }
    getPercentil(id: any) {
        return this.http.get('/consultation/percentil/person/' + id)
    }
    postOdontogram(odontogram: any[]) {
        return this.http.post('/examinationValueDto', odontogram, { asJson: false });
    }
    getOdontogram(personId: any) {
        return this.http.get('/lastexaminationValuesDto?personId=' + personId + '&examinationType=ODONTOGRAMA');
    }
    getTratamientosGenerales(personId: any) {
        return this.http.get('/lastexaminationValuesDto?personId=' + personId + '&examinationType=ODONTOLOGY_GENERAL');
    }
    uploadFiles(file: any) {

        // let headers = new Headers({ 'X-Authorization': 'Bearer ' + currentUser.authToken.token });
        // let header = new RequestOptions({ headers: headers });
        return this.http.post('/secure/files/attachment/upload', file, { secure: false });
    }
    deleteAttachment(consultationId: any, documentId: any) {
        return this.http.delete(`/secure/consultation/${consultationId}/document/${documentId}`, { secure: false });
    }
    downloadAttachment(path: String) {
        return this.http.getNotJSON('/secure/files/download/' + path, { secure: false });
    }
    specialtyModules(id: any) {
        return this.http.get('/consultation/' + id + '/module');
    }
    getVaccinePersonGroup(personId: number) {
        return this.http.get('/secure/vaccinePersonGroup/person/' + personId, { secure: false });
    }
    getPersonhasVaccine(id: any) {
        return this.http.get('/secure/personhasvaccine/person/' + id, { secure: false });
    }
    postPersonhasVaccine(vaccine: any) {
        return this.http.post('/secure/personhasvaccine', vaccine, { secure: false });
    }
    deletePersonhasVaccine(consultationId: any, personHasVaccineId: any) {
        return this.http.delete(`/secure/consultation/${consultationId}/personhasvaccine/${personHasVaccineId}`, { secure: false });
    }
    postConsultationClap(clap: any) {
        return this.http.post('/clap', clap);
    }
    getConsultationClap(consultationId: any) {
        return this.http.get('/clap/consultation/' + consultationId);
    }
    putConsultationClap(clap: any) {
        return this.http.put('/clap', clap);
    }
    getVaccinesByConsultationId(id: number) {
        return this.http.get('/secure/personhasvaccine/consultation/' + id, { secure: false });
    }
    calculatePercentiles(personId: any, isWeek: any, weight: any, height: any, brainRadio: any) {
        return this.http.get('/secure/percentile?personId=' + personId + '&isWeek=' + isWeek + '&weight=' + weight + '&height=' + height + '&brainRadio=' + brainRadio, { secure: false });
    }
    getExaminationStomatology() {
        return this.http.get('/secure/examinationSubItem/examinationSubItemType?examinationTypeCode=STOMATOLOGY', { secure: false });
    }

}