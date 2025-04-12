import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpProviderService } from '../service/http-provider.service';
import { TransactionResponse } from '../interface/transaction.models';
import { CommonModule } from '@angular/common';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, SweetAlert2Module],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  transactionList: TransactionResponse[] = []

  router = inject(Router)
  httpProvider = inject(HttpProviderService)

  constructor() {

    this.getAllTransaction()
  }

  async getAllTransaction() {

    this.httpProvider.getAllTransaction().subscribe({
      next: (data: any) => {
        if (data != null && data.body != null) {
          var resultData = data.body
          if (resultData) {
            this.transactionList = resultData
          }
        }
      },
      error: (error: any) => {
        if (error) {
          if (error.status == 400) {
            if (error.error && error.error.message) {
              this.transactionList = []
            }
          }
        }
      }
    })
  }

  AddTransaction() {
    this.router.navigate(['AddTransaction'])
  }

  deleteTransaction(transaction: TransactionResponse) {

    this.httpProvider.deleteTransaction(transaction._id).subscribe({
      next:(data: any) => {
        if (data != null) {
          this.getAllTransaction()
        }
      },
      error: (error: any) => {}
    })
  }

}
