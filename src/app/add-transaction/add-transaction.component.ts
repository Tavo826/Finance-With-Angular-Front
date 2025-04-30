import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpProviderService } from '../service/http-provider.service';
import { TransactionRequest } from '../interface/transaction.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-transaction',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.css'
})
export class AddTransactionComponent {

  private readonly formBuilder = inject(FormBuilder)
  httpProvider = inject(HttpProviderService);
  router = inject(Router)

  isSubmitted: boolean = false
  errores: string = ""
  transactionTypes: string[] = ["Income", "Output"]
  transactionSubjects: string[] = ["Payment", "Expense", "Debt", "Exchange"]

  form = this.formBuilder.group({
    amount: [0, Validators.min(0.01)],
    type: [''],
    subject: [''],
    person_business: [''],
    description: [''],
    created: [''],
  });

  addTransaction() {
    this.isSubmitted = true

    if (this.form.invalid)  return

    let transaction = this.form.value as TransactionRequest;
    this.httpProvider.saveTransaction(transaction).subscribe({
      next: () => {
        this.router.navigate(['Home'])
      },
      error: err => {
        const errores = err;
      }
    })
  }

}
