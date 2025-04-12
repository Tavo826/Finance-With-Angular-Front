import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
  transactionTypes: string[] = ["Income", "Output"]
  transactionSubjects: string[] = ["Payment", "Expense", "Debt", "Exchange"]

  form = this.formBuilder.group({
    amount: [0],
    type: [''],
    subject: [''],
    person_business: [''],
    description: [''],
    created: [''],
  });

  addTransaction() {
    this.isSubmitted = true
    let transaction = this.form.value as TransactionRequest;
    this.httpProvider.saveTransaction(transaction).subscribe(() => {
      this.router.navigate(['Home'])
    })
  }

}
