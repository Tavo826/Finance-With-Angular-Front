import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { HttpAuthProviderService } from '../../service/http-auth-provider.service';
import { ApiUserResponse, User, UserResponse } from '../../interface/user.models';
import { Router } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AuthService } from '../../shared/auth/auth.service';

@Component({
  selector: 'app-view-user',
  imports: [CommonModule, LoadingComponent, SweetAlert2Module],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.css'
})
export class ViewUserComponent {

  router = inject(Router)
  authService = inject(AuthService)
  httpProvider = inject(HttpAuthProviderService)

  userDetail: UserResponse | undefined
  errors: string = ""

  constructor() {

    this.getUserDetailByEmail()
  }

  getUserDetailByEmail() {
    this.httpProvider.getUserDetailById().subscribe({
      next: (data: ApiUserResponse) => {
        if (data != null && data.body != null) {
          console.log("User data: ", data)
          this.userDetail = data.body
        }
      },
      error: (error: any) => {
        this.errors = error
      }
    })
  }

  EditUser() {
    this.router.navigate(['EditUser', this.userDetail?._id])
  }

  deleteUser(user: UserResponse) {

    this.httpProvider.deleteUser(user._id).subscribe({
      next:(data: any) => {
        if (data != null) {
          this.authService.logout()
        }
      },
      error: (error: any) => {
        this.errors = error
      }
    })
  }

  onImageError(event: any) {
    this.errors = event
  }
}
