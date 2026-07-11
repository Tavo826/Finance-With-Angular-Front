import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../shared/auth/auth.service';
import { ApiReportResponse } from '../interface/report.models';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpReportProviderService {

  private apiUrl = environment.apiURL
  private reportEndpoint = "reports/"
  private http = inject(HttpClient)
  private authService = inject(AuthService)

  constructor() { }

  public generateReport(): Observable<ApiReportResponse> {

    return this.http.get<ApiReportResponse>(this.apiUrl + this.reportEndpoint + 
      "?user_id=" + this.authService.getCurrentUserValue()?._id,
      this.authService.getAuthHeaders()
    )
    .pipe(
      map((response: ApiReportResponse) => response),
      catchError(this.authService.handleError)
    )
  }
}
