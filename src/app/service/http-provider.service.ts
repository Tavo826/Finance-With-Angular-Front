import { inject, Injectable } from '@angular/core';
import { ApiResponse, TransactionRequest } from '../interface/transaction.models';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpProviderService {

  private apiUrl = environment.apiURL
  private http = inject(HttpClient)

  constructor() { }

  public getAllTransaction(page: number, limit: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl + "?page=" + page + "&limit=" + limit)
      .pipe(
        map((response: ApiResponse) => this.returnResponseData(response)),
        catchError(this.handleError)
      )
  }

  public getFilteredTransaction(
    page: number,
    limit: number,
    year: number,
    month: number
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl + 
        "filter?page=" + page + 
        "&limit=" + limit +
        "&year=" + year + 
        "&month=" + month)
      .pipe(
        map((response: ApiResponse) => this.returnResponseData(response)),
        catchError(this.handleError)
      )
  }

  public getTransactionById(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl + id)
      .pipe(
        map((response: ApiResponse) => this.returnResponseData(response)),
        catchError(this.handleError)
      )
  }

  public saveTransaction(model: TransactionRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, model)
      .pipe(
        map((response: ApiResponse) => this.returnResponseData(response)),
        catchError(this.handleError)
      )
  }

  public updateTransaction(id: number, model: TransactionRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.apiUrl + id, model)
    .pipe(
      map((response: ApiResponse) => this.returnResponseData(response)),
      catchError(this.handleError)
    )
  }

  public deleteTransaction(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + id)
    .pipe(
      map((response: any) => this.returnResponseData(response)),
      catchError(this.handleError)
    )
  }

  private returnResponseData(response: any) {
    return response;
  }

  private handleError(error: any) {
    return throwError(() => new Error(error.message));
  }
}
