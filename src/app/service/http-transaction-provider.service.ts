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

  public getAllTransaction(page: number, limit: number): Observable<ApiTransactionResponse> {

    return this.http.get<ApiTransactionResponse>(this.apiUrl + this.transactionsEndpoint + 
      "?page=" + page + 
      "&limit=" + limit +
      "&user_id=" + this.authService.getCurrentUserValue()?._id,
      this.authService.getAuthHeaders()
    )
      .pipe(
        map((response: ApiTransactionResponse) => this.returnResponseData(response)),
        catchError(this.authService.handleError)
      )
  }

  public getFilteredTransaction(
    page: number,
    limit: number,
    year: number,
    month: number
  ): Observable<ApiTransactionResponse> {
    return this.http.get<ApiTransactionResponse>(this.apiUrl + this.transactionsEndpoint +
        "filter?user_id=" + this.authService.getCurrentUserValue()?._id +
        "&page=" + page + 
        "&limit=" + limit +
        "&year=" + year + 
        "&month=" + month,
      this.authService.getAuthHeaders()
    )
      .pipe(
        map((response: ApiTransactionResponse) => this.returnResponseData(response)),
        catchError(this.authService.handleError)
      )
  }

  public getTransactionById(id: string): Observable<ApiTransactionResponse> {
    return this.http.get<ApiTransactionResponse>(this.apiUrl + this.transactionsEndpoint + id,
      this.authService.getAuthHeaders()
    )
      .pipe(
        map((response: ApiTransactionResponse) => this.returnResponseData(response)),
        catchError(this.authService.handleError)
      )
  }

  public saveTransaction(model: TransactionRequest): Observable<ApiTransactionResponse> {
    return this.http.post<ApiTransactionResponse>(this.apiUrl + this.transactionsEndpoint, model,
      this.authService.getAuthHeaders()
    )
      .pipe(
        map((response: ApiTransactionResponse) => this.returnResponseData(response)),
        catchError(this.authService.handleError)
      )
  }

  public updateTransaction(id: string, model: TransactionRequest): Observable<ApiTransactionResponse> {
    return this.http.put<ApiTransactionResponse>(this.apiUrl + this.transactionsEndpoint + id, model,
      this.authService.getAuthHeaders()
    )
    .pipe(
      map((response: ApiTransactionResponse) => this.returnResponseData(response)),
      catchError(this.authService.handleError)
    )
  }

  public deleteTransaction(id: string): Observable<any> {
    return this.http.delete<any>(this.apiUrl + this.transactionsEndpoint + id,
      this.authService.getAuthHeaders()
    )
    .pipe(
      map((response: any) => this.returnResponseData(response)),
      catchError(this.authService.handleError)
    )
  }

  private returnResponseData(response: any) {

    return response;
  }
}
