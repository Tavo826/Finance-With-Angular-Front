import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../shared/auth/auth.service';
import { catchError, map, Observable } from 'rxjs';
import { ApiOriginResponse, ApiOriginResponseList, OriginRequest, OriginResponse } from '../interface/origin.models';
import { url } from 'inspector';

@Injectable({
  providedIn: 'root'
})
export class HttpOriginProviderService {

  private apiUrl = environment.apiURL
  private originsEndpoint = "origins/"
  private http = inject(HttpClient)
  private authService = inject(AuthService)

  constructor() { }

  public getAllOriginByUserId(): Observable<ApiOriginResponseList> {

    return this.http.get<ApiOriginResponseList>(this.apiUrl + this.originsEndpoint + 
      "?user_id=" + this.authService.getCurrentUserValue()?._id,
      this.authService.getAuthHeaders()
    )
    .pipe(
      map((response: ApiOriginResponseList) => this.returnResponseData(response)),
      catchError(this.authService.handleError)
    )
  }

  public getOriginById(id: string): Observable<ApiOriginResponse> {
    return this.http.get<ApiOriginResponse>(this.apiUrl + this.originsEndpoint + id,
      this.authService.getAuthHeaders()
    )
    .pipe(
      map((response: ApiOriginResponse) => this.returnResponseData(response)),
      catchError(this.authService.handleError)
    )
  }

  public saveOrigin(model: OriginRequest): Observable<ApiOriginResponse> {

    return this.http.post<ApiOriginResponse>(this.apiUrl + this.originsEndpoint, model,
      this.authService.getAuthHeaders()
    )
    .pipe(
      map((response: ApiOriginResponse) => this.returnResponseData(response)),
      catchError(this.authService.handleError)
    )
  }

  public updateOrigin(id: string, model: OriginRequest): Observable<ApiOriginResponse> {

    return this.http.put<ApiOriginResponse>(this.apiUrl + this.originsEndpoint + id, model,
      this.authService.getAuthHeaders()
    )
    .pipe(
      map((response: ApiOriginResponse) => this.returnResponseData(response)),
      catchError(this.authService.handleError)
    )
  }

  public deleteOrigin(id: string): Observable<any> {
    return this.http.delete<any>(this.apiUrl + this.originsEndpoint + id,
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
