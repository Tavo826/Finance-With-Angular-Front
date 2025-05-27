import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { HttpAuthProviderService } from '../../service/http-auth-provider.service';
import { ApiUserResponse, UserResponse } from '../../interface/user.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-user',
  imports: [CommonModule, LoadingComponent],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.css'
})
export class ViewUserComponent {

  router = inject(Router)
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
          this.userDetail = data.body
        }
      },
      error: (error: any) => {
        console.log("Error: ", error)
        this.errors = error
      }
    })
  }

  EditUser() {
    this.router.navigate(['EditUser', this.userDetail?._id])
  }
}
