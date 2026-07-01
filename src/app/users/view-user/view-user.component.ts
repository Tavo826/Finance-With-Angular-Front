import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { ErrorAlertComponent } from '../../shared/error-alert/error-alert.component';
import { HttpAuthProviderService } from '../../service/http-auth-provider.service';
import { ApiUserResponse, User, UserResponse } from '../../interface/user.models';
import { Router } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AuthService } from '../../shared/auth/auth.service';
import { HttpReportProviderService } from '../../service/http-report-provider.service';

@Component({
  selector: 'app-view-user',
  imports: [CommonModule, LoadingComponent, SweetAlert2Module, ErrorAlertComponent],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.css'
})
export class ViewUserComponent {

  router = inject(Router)
  authService = inject(AuthService)
  httpAuthProvider = inject(HttpAuthProviderService)
  httpReportProvider = inject(HttpReportProviderService)

  userDetail: UserResponse | undefined
  errors: string = ""

  constructor() {

    this.getUserDetailById()
  }

  getUserDetailById() {
    this.httpAuthProvider.getUserDetailById().subscribe({
      next: (data: ApiUserResponse) => {
        if (data != null && data.body != null) {
          this.userDetail = data.body
        }
      },
      error: (error: any) => {
        this.errors = error?.message || 'An unexpected error occurred'
      }
    })
  }

  EditUser() {
    this.router.navigate(['EditUser', this.userDetail?._id])
  }

  deleteUser(user: UserResponse) {

    this.httpAuthProvider.deleteUser(user._id).subscribe({
      next:(data: ApiUserResponse) => {
        if (data != null) {
          this.authService.logout()
        }
      },
      error: (error: any) => {
        this.errors = error?.message || 'An unexpected error occurred'
      }
    })
  }

  sendReport() {

    this.httpReportProvider.generateReport().subscribe({
      next: (data: any) => {
        if (data != null && data.body != null) {
          this.router.navigate(['Home'])
        }
      },
      error: (error: any) => {
        this.errors = error?.message || 'An unexpected error occurred'
      }
    })
  }

  onImageError(event: any) {
    this.errors = event
  }
}
