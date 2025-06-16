import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpOriginProviderService } from '../../service/http-origin-provider.service';
import { AuthService } from '../../shared/auth/auth.service';
import { OriginRequest } from '../../interface/origin.models';

@Component({
  selector: 'app-add-origin',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './add-origin.component.html',
  styleUrl: './add-origin.component.css'
})
export class AddOriginComponent {

  private readonly formBuilder = inject(FormBuilder)
  httpProvider = inject(HttpOriginProviderService)
  router = inject(Router)
  authService = inject(AuthService)

  isSubmitted: boolean = false
  errors: string = ""

  form = this.formBuilder.group({
    name: [''],
    total: [0, Validators.min(0.01)]
  })

  addOrigin() {
    this.isSubmitted = true

    if (this.form.invalid) return

    let origin = this.form.value as OriginRequest
    origin.user_id = this.authService.getCurrentUserValue()?._id!

    this.httpProvider.saveOrigin(origin).subscribe({
      next: () => {
        this.router.navigate(['ViewOrigin'])
      },
      error: err => {
        this.errors = err;
      }
    })
  }

}
