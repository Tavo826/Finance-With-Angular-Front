import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiAuthRespose, ApiUserResponse, LoginRequest, RegisterRequest, User } from '../interface/user.models';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
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

  public getUserDetailByEmail() {
    return this.http.get<ApiUserResponse>(this.apiUrl + this.usersEndpoint + "?email=" + this.authService.getEmail())
      .pipe(
          map((response: ApiUserResponse) => this.returnResponseData(response)),
          catchError(this.authService.handleLoginError)
        )
  }

  private returnResponseData(response: any) {

    return response;
  }
}
