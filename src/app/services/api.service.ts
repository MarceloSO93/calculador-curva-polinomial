import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Graphic } from '../models/Graphic';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/polynomial-calculator/v1/process-coordinates'; // Substitua pela URL da API

  constructor(private http: HttpClient) { }

  postCoordinates(coordinates:any[]): Observable<Graphic> {
    return this.http.post<Graphic>(this.apiUrl, coordinates );
  }
}
