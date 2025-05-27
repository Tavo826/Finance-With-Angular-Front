import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpAuthProviderService } from '../../service/http-auth-provider.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';
import { ApiUserResponse, UserRequest } from '../../interface/user.models';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-edit-user',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, LoadingComponent],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent {

  private readonly formBuilder = inject(FormBuilder)
  httpProvider = inject(HttpAuthProviderService)
  router = inject(Router)
  route = inject(ActivatedRoute)
  authService = inject(AuthService)

  isSubmitted = false
  errores: string = ""
  userId = this.route.snapshot.params['userId']
  editUser: any

  constructor() {
    this.getUserDetailById()
  }

  form = this.formBuilder.group({
    username: [""],
    email: [""],
  })

  getUserDetailById() {

    this.httpProvider.getUserDetailById().subscribe({
      next: (data: ApiUserResponse) => {
        if (data != null && data.body != null) {
          var resultData = data.body

          this.form.patchValue(resultData)
        }
      },
      error: (error: any) => {
        this.errores = error
      }
    })
  }

  EditUser(isValid: boolean) {

    this.isSubmitted = true

    if (this.form.invalid)  return
        
    if (isValid) {
      let user = this.form.value as UserRequest;
      this.httpProvider.updateUser(this.userId, user).subscribe(() => {
        this.router.navigate(['ViewUser'])
      })
    }
  }

}
