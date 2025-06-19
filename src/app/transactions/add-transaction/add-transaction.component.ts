import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpTransactionProviderService } from '../../service/http-transaction-provider.service';
import { TransactionRequest } from '../../interface/transaction.models';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/auth/auth.service';
import { HttpOriginProviderService } from '../../service/http-origin-provider.service';
import { OriginResponse } from '../../interface/origin.models';

@Component({
  selector: 'app-add-transaction',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.css'
})
export class AddTransactionComponent {

  private readonly formBuilder = inject(FormBuilder)
  httpTransactionProvider = inject(HttpTransactionProviderService)
  httpOriginProvider = inject(HttpOriginProviderService)
  router = inject(Router)
  authService = inject(AuthService)

  isSubmitted: boolean = false
  errors: string = ""
  transactionTypes: string[] = ["Income", "Output"]
  transactionSubjects: string[] = ["Payment", "Expense", "Debt"]
  originMap = new Map<string, string>()
  originList: string[] = []

  constructor() {
    this.getOriginsByUserId()
  }

  form = this.formBuilder.group({
    amount: [0, Validators.min(0.01)],
    type: [''],
    subject: [''],
    person_business: [''],
    description: [''],
    origin_id: [''],
    created: [''],
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

  addTransaction() {
    this.isSubmitted = true

    if (this.form.invalid)  return

    let transaction = this.form.value as TransactionRequest;
    let formValues = this.form.value

    transaction.user_id = this.authService.getCurrentUserValue()?._id!
    transaction.origin_id = this.originMap.get(formValues.origin_id || "") || ""
    
    this.httpTransactionProvider.saveTransaction(transaction).subscribe({
      next: () => {
        this.router.navigate(['Home'])
      },
      error: err => {
        this.errors = err;
      }
    })
  }

}
