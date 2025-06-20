import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { HttpOriginProviderService } from '../../service/http-origin-provider.service';
import { AuthService } from '../../shared/auth/auth.service';
import { ApiOriginResponse, OriginRequest, OriginResponse } from '../../interface/origin.models';

@Component({
  selector: 'app-edit-origin',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, LoadingComponent],
  templateUrl: './edit-origin.component.html',
  styleUrl: './edit-origin.component.css'
})
export class EditOriginComponent {

  private readonly formBuilder = inject(FormBuilder)
  httpProvider = inject(HttpOriginProviderService)
  router = inject(Router)
  route = inject(ActivatedRoute)
  authService = inject(AuthService)

  isSubmitted = false
  errors: string = ""
  originId = this.route.snapshot.params['originId']
  editOrigin: any

  constructor() {
    this.getOriginDetailById()
  }

  form = this.formBuilder.group({
    name: [''],
    total: [0, Validators.min(0.01)],
    created_at: [''],
    updated_at: [''],
  })

  getOriginDetailById() {

    this.httpProvider.getOriginById(this.originId).subscribe({
      next: (data: ApiOriginResponse) => {
        if (data != null && data.body != null) {
          var resultData = data.body

          this.form.patchValue(resultData)
        }
      },
      error: (error: any) => {
        this.errors = error
      }
    })
  }

  EditOrigin(isValid: boolean) {

    this.isSubmitted = true

    if (this.form.invalid) return

    if(isValid) {
      let origin = this.form.value as OriginRequest
      origin.user_id = this.authService.getCurrentUserValue()?._id!
      this.httpProvider.updateOrigin(this.originId, origin).subscribe({
        next: () => {
          this.router.navigate(['ViewOrigin'])
        },
        error: (error: any) => {
          this.errors = error
        }
      })
    }
  }

}
