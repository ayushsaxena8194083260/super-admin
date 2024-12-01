import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConstantsHelper } from '../constant/constant';

interface ApiUrlMap {
  [key: string]: (params: any) => string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  public makeApiRequest(
    method: string,
    endpoint: string,
    data?: any,
    params?: any,
    token?:any
  ): Observable<any> {
    const url = (ConstantsHelper.getAPIUrl as ApiUrlMap)[endpoint](params);


    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token || '',  // Include token if provided
    });

    switch (method) {
      case 'GET':
        return this.http.get(url, { headers }).pipe(
          map((response: any) => response), // Change HttpResponse<any> to any
          catchError((error) => this.handleError(error))
        );

      case 'POST':
        return this.http.post(url, data, { headers }).pipe(
          map((response: any) => response), // Change HttpResponse<any> to any
          catchError((error) => this.handleError(error))
        );

      case 'PUT':
        return this.http.put(url, data, { headers }).pipe(
          map((response: any) => response), // Change HttpResponse<any> to any
          catchError((error) => this.handleError(error))
        );

      default:
        console.error(`Invalid HTTP method: ${method}`);
        return throwError('Invalid HTTP method');
    }
  }

  // Handle errors
  private handleError(error: any): Observable<never> {
    // Customize error handling based on your requirements
    console.error('API Error:', error);
    return throwError('Something went wrong. Please try again later.');
  }
}
