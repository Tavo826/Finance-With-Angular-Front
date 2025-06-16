import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpTransactionProviderService } from '../../service/http-transaction-provider.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiTransactionResponse, TransactionRequest } from '../../interface/transaction.models';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../shared/loading/loading.component";
import { AuthService } from '../../shared/auth/auth.service';
import { OriginResponse } from '../../interface/origin.models';
import { HttpOriginProviderService } from '../../service/http-origin-provider.service';

@Component({
  selector: 'app-edit-transaction',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, LoadingComponent],
  templateUrl: './edit-transaction.component.html',
  styleUrl: './edit-transaction.component.css'
})
export class EditTransactionComponent {

  private readonly formBuilder = inject(FormBuilder)
  httpTransactionProvider = inject(HttpTransactionProviderService)
  httpOriginProvider = inject(HttpOriginProviderService)
  router = inject(Router)
  route = inject(ActivatedRoute)
  authService = inject(AuthService)

  isSubmitted = false
  errors: string = ""
  transactionId = this.route.snapshot.params['transactionId']
  editTransaction: any
  originMap = new Map<string, string>()
  originList: string[] = []

  transactionTypes: string[] = ["Income", "Output"]
  transactionSubjects: string[] = ["Payment", "Expense", "Debt", "Exchange"]

  constructor() {
    this.getOriginsByUserId()
    this.getTransactionDetailById()
  }

  form = this.formBuilder.group({
    amount: [0, Validators.min(0.01)],
    type: [''],
    subject: [''],
    person_business: [''],
    description: [''],
    origin_id: [''],
    created: [''],
    created_at: [''],
    updated_at: [''],
  });

  getOriginsByUserId() {

    let originResponse: OriginResponse[]

    this.httpOriginProvider.getAllOriginByUserId().subscribe({
      next: (data: any) => {
        if (data != null && data.body != null) {
          originResponse = data.body
          originResponse.forEach(origin => {
            this.originMap.set(origin.name, origin._id)
            this.originList.push(origin.name)
          })
        }
      },
      error: (error: any) => {
        this.errors = error
      } 
    })
  }

  getTransactionDetailById() {

    this.httpTransactionProvider.getTransactionById(this.transactionId).subscribe({
      next: (data: ApiTransactionResponse) => {
        if (data != null && data.body != null) {
          var resultData = data.body

          const formData = {
            ...resultData,
            origin: resultData.origin?.name
          }

          this.form.patchValue(formData)
        }
      },
      error: (error: any) => {
        this.errors = error
      }
    })
  }

  EditTransaction(isValid: boolean) {

    this.isSubmitted = true

    if (this.form.invalid)  return
    
    if (isValid) {

      let transaction = this.form.value as TransactionRequest;
      let formValues = this.form.value

      transaction.user_id = this.authService.getCurrentUserValue()?._id!
      transaction.origin_id = this.originMap.get(formValues.origin_id || "") || ""

      this.httpTransactionProvider.updateTransaction(this.transactionId, transaction).subscribe(() => {
        this.router.navigate(['Home'])
      })
    }
  }

}
