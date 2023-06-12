import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Person } from '../models/person';
import { Page, QueryBuilder } from '../_util/pagination';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private endpoint = '/v1/pessoa'

  queryParams: string
  constructor(private http: HttpClient) { }


  findAllPagenated(queryBuilder: QueryBuilder): Observable<HttpResponse<Page<Person>>> {
    return this.http
      .get<Page<Person>>(`${API_CONFIG.baseUrl}${this.endpoint}?${queryBuilder.buildQueryString()}`, {observe: 'response' })
      
  }

  // findAll(page: MatPaginator): Observable<Response[]> {
  //   if (page) {
  //     this.queryParams = `?size=${page.pageSize}&number=${page.pageIndex}`
  //   } else {
  //     this.queryParams = ''
  //   }

  //   return this.http.get<Response[]>(`${API_CONFIG.baseUrl}${this.endpoint}${this.queryParams}`, {})
  // }

  create(person: Person): Observable<Person> {
    return this.http.post<Person>(`${API_CONFIG.baseUrl}/v1/pessoa`, person)
  }

  update(person: Person): Observable<Person> {
    return this.http.put<Person>(`${API_CONFIG.baseUrl}/v1/pessoa/${person.id}`, person)
  }

  delete(person: Person): Observable<Person> {
    return this.http.delete<Person>(`${API_CONFIG.baseUrl}/v1/pessoa/${person.id}`)
  }
}
