import { Component, inject } from '@angular/core';
import { ApiTransactionResponse, TransactionResponse } from '../../interface/transaction.models';
import { ActivatedRoute } from '@angular/router';
import { HttpTransactionProviderService } from '../../service/http-transaction-provider.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../shared/loading/loading.component";

@Component({
  selector: 'app-view-transaction',
  imports: [CommonModule, LoadingComponent],
  templateUrl: './view-transaction.component.html',
  styleUrl: './view-transaction.component.css'
})
export class ViewTransactionComponent {

  route = inject(ActivatedRoute)
  httpProvider = inject(HttpTransactionProviderService)

  transactionDetail: TransactionResponse | undefined
  transactionId = this.route.snapshot.params['transactionId']
  errors: string = ""

  constructor() {

    this.getTransactionDetailById()
  }

  getTransactionDetailById() {
    this.httpProvider.getTransactionById(this.transactionId).subscribe({
      next: (data: ApiTransactionResponse) => {
        if (data != null && data.body != null) {
          this.transactionDetail = data.body
        }
      },
      error: (error: any) => {
        this.errors = error
      }
    })
  }
}
