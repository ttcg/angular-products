import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Company } from './company-models';
import { AppConfig } from '../../config/appConfig';
import { Observable, catchError } from 'rxjs';
import { handleError } from '../utility';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  constructor(private http: HttpClient) {

  }

  filterCompanies(type: string): Observable<Company[]> {
    const url = `${AppConfig.apiUrl}/companies`;

    const httpParams = new HttpParams({ fromObject: { type } });
    return this.http.get<Company[]>(url, { params: httpParams })
      .pipe(
        catchError(handleError<Company[]>('filterCompanies'))
      );
  }
}
