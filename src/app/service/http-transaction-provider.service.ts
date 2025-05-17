import { inject, Injectable } from '@angular/core';
import { ApiTransactionResponse, TransactionRequest } from '../interface/transaction.models';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../shared/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpTransactionProviderService {

  private apiUrl = environment.apiURL
  private transactionsEndpoint = "transactions/"
  private http = inject(HttpClient)
  private authService = inject(AuthService)

  constructor() { }

  private getAuthHeaders() {
  const token = this.authService.getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
}

  public getAllTransaction(page: number, limit: number): Observable<ApiTransactionResponse> {

    return this.http.get<ApiTransactionResponse>(this.apiUrl + this.transactionsEndpoint + "?page=" + page + "&limit=" + limit,
      this.getAuthHeaders()
    )
      .pipe(
        map((response: ApiTransactionResponse) => this.returnResponseData(response)),
        catchError(this.handleError)
      )
  }

  public getFilteredTransaction(
    page: number,
    limit: number,
    year: number,
    month: number
  ): Observable<ApiTransactionResponse> {
    return this.http.get<ApiTransactionResponse>(this.apiUrl + this.transactionsEndpoint +
        "filter?page=" + page + 
        "&limit=" + limit +
        "&year=" + year + 
        "&month=" + month,
      this.getAuthHeaders()
    )
      .pipe(
        map((response: ApiTransactionResponse) => this.returnResponseData(response)),
        catchError(this.handleError)
      )
  }

  public getTransactionById(id: number): Observable<ApiTransactionResponse> {
    return this.http.get<ApiTransactionResponse>(this.apiUrl + this.transactionsEndpoint + id,
      this.getAuthHeaders()
    )
      .pipe(
        map((response: ApiTransactionResponse) => this.returnResponseData(response)),
        catchError(this.handleError)
      )
  }

  public saveTransaction(model: TransactionRequest): Observable<ApiTransactionResponse> {
    return this.http.post<ApiTransactionResponse>(this.apiUrl + this.transactionsEndpoint, model,
      this.getAuthHeaders()
    )
      .pipe(
        map((response: ApiTransactionResponse) => this.returnResponseData(response)),
        catchError(this.handleError)
      )
  }

  public updateTransaction(id: number, model: TransactionRequest): Observable<ApiTransactionResponse> {
    return this.http.put<ApiTransactionResponse>(this.apiUrl + this.transactionsEndpoint + id, model,
      this.getAuthHeaders()
    )
    .pipe(
      map((response: ApiTransactionResponse) => this.returnResponseData(response)),
      catchError(this.handleError)
    )
  }

  public deleteTransaction(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + this.transactionsEndpoint + id,
      this.getAuthHeaders()
    )
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
