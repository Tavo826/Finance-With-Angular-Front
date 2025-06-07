import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpAuthProviderService } from '../../service/http-auth-provider.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';
import { ApiUserResponse, EditUserRequest } from '../../interface/user.models';
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
  errors: string = ""
  userId = this.route.snapshot.params['userId']
  editUser: any
  selectedFile: File | null = null
  imagePreview: string | null = null
  currentProfileImage: string | null = null

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

          if (resultData.profile_image) {
            this.currentProfileImage = resultData.profile_image
            this.imagePreview = resultData.profile_image
          }
        }
      },
      error: (error: any) => {
        this.errors = error
      }
    })
  }

  onFileSelected(event: any) {
    const file = event.target.files[0]

    if (file) {

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        this.errors = "File type not allowed (JPEG, PNG, GIF)"
        return
      }

      const maxSize = 5 * 1024 * 1024 //5MB
      if (file.size > maxSize) {
        this.errors = "File too long. Max 5MB"
        return
      }

      this.selectedFile = file
      this.errors = ""

      const reader = new FileReader()
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  removeImage() {
    this.selectedFile = null
    this.imagePreview = this.currentProfileImage

    const fileInput = document.getElementById('profileImage') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  EditUser(isValid: boolean) {

    this.isSubmitted = true

    if (this.form.invalid)  return
        
    if (isValid) {

      const formValues = this.form.value

      const user: EditUserRequest = {
        username: formValues.username || '',
        email: formValues.email || '',
        profileImage: this.selectedFile || ''
      }

      this.httpProvider.updateUser(this.userId, user).subscribe({
        next: () => {
          this.router.navigate(['ViewUser'])
        },
        error: (error: any) => {
          this.errors = error
        }
      })
    }
  }

}
