import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ApiAuthRespose, User } from '../../interface/user.models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User | null>
  private currentUser$: Observable<User | null>
  private tokenKey = "token_key"
  private userId = "user_id"
  private username = "username"
  private email = "email"

  private router = inject(Router)

  constructor() {
    const storedUser = this.getUserFromStorage()
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser)
    this.currentUser$ = this.currentUserSubject.asObservable()
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserId(): string | null {
    return localStorage.getItem(this.userId)
  }

  getUsername() {
    return localStorage.getItem(this.username)
  }

  getEmail() {
    return localStorage.getItem(this.email)
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {

    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.userId)
    localStorage.removeItem(this.username)
    localStorage.removeItem(this.email)
    this.currentUserSubject.next(null)
    this.router.navigate(['/Login'])
  }

  handleAuthentication(response: ApiAuthRespose): ApiAuthRespose {

    localStorage.setItem(this.tokenKey, response.body.token)
    localStorage.setItem(this.userId, response.body.user._id)
    localStorage.setItem(this.username, response.body.user.username)
    localStorage.setItem(this.email, response.body.user.email)

    this.currentUserSubject.next(response.body.user)

    return response
  }

  handleLoginError(error: any) {
    let errorMessage = "An error ocurred in the request"

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`
    } else if (error.status) {

      if (error.status === 401) {
        errorMessage = 'Invalid credentials'
      } else {
        errorMessage = `Error ${error.status}: ${error.error?.error || error.statusText}`
      }
    }

    return throwError(() => new Error(errorMessage))
  }

  handleError(error: any) {
    let errorMessage = "An error ocurred in the request"

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`
    } else if (error.status) {
      errorMessage = `Error ${error.status}: ${error.error?.error || error.statusText}`

      if (error.status === 401 && this.getToken()) {
        this.logout()
      }
    }

    return throwError(() => new Error(errorMessage))
  }

  private getUserFromStorage(): User | null {
    const token = this.getToken()

    if (token) {
      try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))

        const payload = JSON.parse(jsonPayload)

        return {
          _id: payload.id,
          email: payload.email,
          username: payload.username || payload.email.split('@')[0],
          role: payload.role
        }
      } catch (e) {
        this.logout()
        return null
      }
    }

    return null
  }
}
