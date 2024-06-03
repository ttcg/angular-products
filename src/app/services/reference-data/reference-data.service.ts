import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../config/appConfig';
import { ReferenceDataItem } from './reference-data-models';
import { Observable, catchError } from 'rxjs';
import { handleError } from '../utility';

@Injectable({
  providedIn: 'root'
})
export class ReferenceDataService {

  constructor(private http: HttpClient) { }

  getCountries(): Observable<ReferenceDataItem[]> {

    const url = `${AppConfig.apiUrl}/countries`;

    return this.http.get<ReferenceDataItem[]>(url)
      .pipe(
        catchError(handleError<ReferenceDataItem[]>('getCountries'))
      );
  }

  getUnitOfMeasures(): Observable<ReferenceDataItem[]> {

    const url = `${AppConfig.apiUrl}/unit-of-measures`;

    return this.http.get<ReferenceDataItem[]>(url)
      .pipe(
        catchError(handleError<ReferenceDataItem[]>('getUnitOfMeasures'))
      );
  }
}
