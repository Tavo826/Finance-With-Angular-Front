import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpProviderService } from '../service/http-provider.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiResponse, TransactionRequest } from '../interface/transaction.models';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../shared/loading/loading.component";

@Component({
  selector: 'app-edit-transaction',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, LoadingComponent],
  templateUrl: './edit-transaction.component.html',
  styleUrl: './edit-transaction.component.css'
})
export class EditTransactionComponent {

  private readonly formBuilder = inject(FormBuilder)
  httpProvider = inject(HttpProviderService)
  router = inject(Router)
  route = inject(ActivatedRoute)

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
    amount: [0],
    type: [''],
    subject: [''],
    person_business: [''],
    description: [''],
    created: [''],
  });

  getTransactionDetailById() {

    this.httpProvider.getTransactionById(this.transactionId).subscribe({
      next: (data: ApiResponse) => {
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
    if (isValid) {
      let transaction = this.form.value as TransactionRequest;
      this.httpProvider.updateTransaction(this.transactionId, transaction).subscribe(() => {
        this.router.navigate(['Home'])
      })
    }
  }

}
