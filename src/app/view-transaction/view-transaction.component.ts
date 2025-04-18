import { Component, inject } from '@angular/core';
import { ApiResponse, TransactionResponse } from '../interface/transaction.models';
import { ActivatedRoute } from '@angular/router';
import { HttpProviderService } from '../service/http-provider.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../shared/loading/loading.component";

@Component({
  selector: 'app-view-transaction',
  imports: [CommonModule, LoadingComponent],
  templateUrl: './view-transaction.component.html',
  styleUrl: './view-transaction.component.css'
})
export class ViewTransactionComponent {

  route = inject(ActivatedRoute)
  httpProvider = inject(HttpProviderService)

  transactionDetail: TransactionResponse | undefined
  transactionId = this.route.snapshot.params['transactionId']
  errores: string = ""

  constructor() {

    this.getTransactionDetailById()
  }

  getTransactionDetailById() {
    this.httpProvider.getTransactionById(this.transactionId).subscribe({
      next: (data: ApiResponse) => {
        if (data != null && data.body != null) {
          this.transactionDetail = data.body
        }
      },
      error: (error: any) => {
        this.errores = error
      }
    })
  }
}
