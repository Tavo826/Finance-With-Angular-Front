import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpAuthProviderService } from '../../service/http-auth-provider.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { ErrorAlertComponent } from '../../shared/error-alert/error-alert.component';
import { LoginRequest } from '../../interface/user.models';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, LoadingComponent, RouterLink, ErrorAlertComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private readonly formBuilder = inject(FormBuilder)
  httpProvider = inject(HttpAuthProviderService)
  router = inject(Router)

  isSubmitted: boolean = false
  isLoading: boolean = false
  errors: string = ""

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  })

  logIn() {

    this.isSubmitted = true

    if (this.form.invalid)  return

    this.isLoading = true;

    let loginData = this.form.value as LoginRequest
    this.httpProvider.logUser(loginData).subscribe({
      next: () => {
        this.isLoading = false
        this.router.navigate(['Home'])
      },
      error: err => {
        this.errors = err?.message || 'An unexpected error occurred'
        this.isLoading = false
      }
    })
  }
}
