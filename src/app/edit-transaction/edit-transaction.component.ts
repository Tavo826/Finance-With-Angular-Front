import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpTransactionProviderService } from '../service/http-transaction-provider.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiTransactionResponse, TransactionRequest } from '../interface/transaction.models';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../shared/loading/loading.component";
import { AuthService } from '../shared/auth/auth.service';

@Component({
  selector: 'app-edit-transaction',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, LoadingComponent],
  templateUrl: './edit-transaction.component.html',
  styleUrl: './edit-transaction.component.css'
})
export class EditTransactionComponent {

  private readonly formBuilder = inject(FormBuilder)
  httpProvider = inject(HttpTransactionProviderService)
  router = inject(Router)
  route = inject(ActivatedRoute)
  authService = inject(AuthService)

  isSubmitted = false
  errores: string = ""
  transactionId = this.route.snapshot.params['transactionId']
  editTransaction: any

  transactionTypes: string[] = ["Income", "Output"]
  transactionSubjects: string[] = ["Payment", "Expense", "Debt", "Exchange"]

  constructor() {
    this.getTransactionDetailById()
  }

  form = this.formBuilder.group({
    amount: [0, Validators.min(0.01)],
    type: [''],
    subject: [''],
    person_business: [''],
    description: [''],
    created: [''],
    created_at: [''],
    updated_at: [''],
  });

  getTransactionDetailById() {

    this.httpProvider.getTransactionById(this.transactionId).subscribe({
      next: (data: ApiTransactionResponse) => {
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

  EditTransaction(isValid: boolean) {

    this.isSubmitted = true

    if (this.form.invalid)  return
    
    if (isValid) {
      let transaction = this.form.value as TransactionRequest;
      transaction.user_id = this.authService.getUserId()!
      this.httpProvider.updateTransaction(this.transactionId, transaction).subscribe(() => {
        this.router.navigate(['Home'])
      })
    }
  }

}
