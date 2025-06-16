import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpAuthProviderService } from '../../service/http-auth-provider.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { RegisterRequest } from '../../interface/user.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, LoadingComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  private readonly formBuilder = inject(FormBuilder)
  httpProvider = inject(HttpAuthProviderService)
  router = inject(Router)

  isSubmitted: boolean = false
  isLoading: boolean = false
  errors: string = ""

  form = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  }, {
    validators: this.passwordMatchValidation
  })

  registerUser() {
    this.isSubmitted = true

    if (this.form.invalid)  return

    this.isLoading = true;

    const registerData: RegisterRequest = {
      username: this.form.controls['username'].value!,
      email: this.form.controls['email'].value!,
      password: this.form.controls['password'].value!,
    }
    
    this.httpProvider.registerUser(registerData).subscribe({
      next: () => {
        this.isLoading = false
        this.showOriginAlert()
      },
      error: err => {
        this.errors = err;
        this.isLoading = false
      }
    })
  }

  private showOriginAlert() {
    
    Swal.fire({
      title: 'User successfully registered!',
      text: 'Do you want to add origins for your money?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: "#6c757d",
      confirmButtonText: 'Yeah, add origins',
      cancelButtonText: 'Nope, add later',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/AddOrigin'])
      } else {
        this.router.navigate(['/Home'])
      }
    })
  }

  passwordMatchValidation(group: any) {
    const password = group.get('password')?.value
    const confirmPassword = group.get('confirmPassword')?.value

    if (password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      group.get('confirmPassword')?.setErrors(null);
      return null;
    }
  }
}
