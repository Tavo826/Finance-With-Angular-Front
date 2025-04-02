import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebApiService {

  constructor(private httpClient: HttpClient) { }

  get(url: string): Observable<any> {
    
    return this.httpClient.get(url)
      .pipe(
        map((response: any) => this.ReturnResponseData(response)),
        catchError(this.handleError)
      );
  }

  post(url: string, model: any): Observable<any> {

    return this.httpClient.post(url, model)
      .pipe(
        map((response: any) => this.ReturnResponseData(response)),
        catchError(this.handleError)
      );
  }

  put(url: string, model: any): Observable<any> {

    return this.httpClient.put(url, model)
      .pipe(
        map((response: any) => this.ReturnResponseData(response)),
        catchError(this.handleError)
      );
  }

  delete(url: string): Observable<any> {

    return this.httpClient.delete(url)
      .pipe(
        map((response: any) => this.ReturnResponseData(response)),
        catchError(this.handleError)
      );
  }

  private ReturnResponseData(response: any) {
    return response;
  }

  private handleError(error: any) {
    return throwError(() => new Error(error.message));
  }

}
