import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ApiAuthRespose, ApiUserResponse, LoginRequest, RegisterRequest, User, UserRequest } from '../interface/user.models';
import { catchError, map, Observable } from 'rxjs';
import { AuthService } from '../shared/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpAuthProviderService {

  private http = inject(HttpClient)
  private authService = inject(AuthService)

  private apiUrl = environment.apiURL
  private usersEndpoint = "users/"

  constructor() {}

  public registerUser(model: RegisterRequest): Observable<ApiAuthRespose> {
    return this.http.post<ApiAuthRespose>(this.apiUrl + this.usersEndpoint + "register", model)
      .pipe(
        map((response: ApiAuthRespose) => this.authService.handleAuthentication(response)),
        catchError(this.authService.handleError)
      )
  }

  public logUser(model: LoginRequest): Observable<ApiAuthRespose> {
    return this.http.post<ApiAuthRespose>(this.apiUrl + this.usersEndpoint + "login", model)
      .pipe(
        map((response: ApiAuthRespose) => this.authService.handleAuthentication(response)),
        catchError(this.authService.handleLoginError)
      )
  }

  public getUserDetailById() {
    return this.http.get<ApiUserResponse>(this.apiUrl + this.usersEndpoint + "?id=" + this.authService.getCurrentUserValue()?._id,
      this.authService.getAuthHeaders()
    )
      .pipe(
          map((response: ApiUserResponse) => this.returnResponseData(response)),
          catchError(this.authService.handleError)
        )
  }

  public updateUser(id: string, model: FormData) {

    return this.http.put<ApiUserResponse>(this.apiUrl + this.usersEndpoint + id, model,
      this.authService.getAuthHeaders()
    )
    .pipe(
      map((response: any) => this.returnResponseData(response)),
      catchError(this.authService.handleError)
    )
  }

  public deleteUser(id: string): Observable<any> {

    return this.http.delete<any>(this.apiUrl + this.usersEndpoint + id,
      this.authService.getAuthHeaders()
    )
      .pipe(
        map((response: any) => this.returnResponseData(response)),
        catchError(this.authService.handleError)
      );
  }

  private returnResponseData(response: any) {

    return response;
  }
}
