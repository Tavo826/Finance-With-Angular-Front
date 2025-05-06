import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpProviderService } from '../service/http-provider.service';
import { TransactionResponse } from '../interface/transaction.models';
import { CommonModule } from '@angular/common';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { LoadingComponent } from "../shared/loading/loading.component";
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, SweetAlert2Module, LoadingComponent, NgbPaginationModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  isLoading: boolean = true
  errores: string = ""
  transactionList: TransactionResponse[] = []
  totalTransactions = 0
  page = 1
  limit = 10

  router = inject(Router)
  httpProvider = inject(HttpProviderService)

  constructor() {

    this.getAllTransaction(this.page, this.limit)
  }

  async getAllTransaction(page: number, limit: number) {

    this.isLoading = true

    this.httpProvider.getAllTransaction(page, limit).subscribe({
      next: (data: any) => {
        if (data != null && data.body != null) {
          var resultData = data.body
          if (resultData) {
            this.transactionList = resultData.data
            this.totalTransactions = resultData.totalDocuments
            this.isLoading = false
          }
        } else{
          this.transactionList = []
          this.isLoading = false
        }
      },
      error: (error: any) => {
        this.errores = error
      }
    })
  }

  pageChange(event: number) {
    this.page = event
    this.getAllTransaction(event, this.limit)
  }

  AddTransaction() {
    this.router.navigate(['AddTransaction'])
  }

  deleteTransaction(transaction: TransactionResponse) {

    this.httpProvider.deleteTransaction(transaction._id).subscribe({
      next:(data: any) => {
        if (data != null) {
          this.getAllTransaction(this.page, this.limit)
        }
      },
      error: (error: any) => {}
    })
  }

}
