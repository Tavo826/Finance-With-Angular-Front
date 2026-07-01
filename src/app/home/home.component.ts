import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpTransactionProviderService } from '../service/http-transaction-provider.service';
import { ApiTransactionResponse, ApiTransactionResponseList, TransactionResponse } from '../interface/transaction.models';
import { CommonModule } from '@angular/common';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { LoadingComponent } from "../shared/loading/loading.component";
import { ErrorAlertComponent } from "../shared/error-alert/error-alert.component";
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ApiOriginResponseList, OriginResponse } from '../interface/origin.models';
import { HttpOriginProviderService } from '../service/http-origin-provider.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, SweetAlert2Module, LoadingComponent, NgbPaginationModule, FormsModule, ErrorAlertComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  isLoading: boolean = true
  isTotalVisible: boolean = false;
  errors: string = ""
  transactionList: TransactionResponse[] = []
  totalTransactions = 0
  totalBudget = 0
  page = 1
  limit = 20
  years: number[] = []

  filterVisible = false

  selectedYear!: number
  selectedMonth!: string
  months = new Map(
    Array.from({ length: 12 }, (_, i) => [
      new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(2000, i)),
      i + 1
    ])
  )

  selectedFilterType: string = 'date'
  selectedSubject: string = ""
  selectedPersonBusiness: string = ""
  transactionSubjects: string[] = ["Payment", "Expense", "Debt", "Exchange"]

  isFilterActive = false

  router = inject(Router)
  httpTransactionProvider = inject(HttpTransactionProviderService)
  httpOriginProvider = inject(HttpOriginProviderService)

  constructor() {

    const currentYear = new Date().getFullYear()
    this.years = this.getYearsArray(2025, currentYear)
    this.selectedYear = currentYear
    this.selectedMonth = ""
    this.getAllOrigin()
    this.getAllTransaction(this.page, this.limit)
  }

  toggleTotalVisibility(): void {
    this.isTotalVisible = !this.isTotalVisible;
  }

  getAllOrigin() {

    this.isLoading = true
    let originList: OriginResponse[] = []

    this.httpOriginProvider.getAllOriginByUserId().subscribe({
      next: (data: ApiOriginResponseList) => {
        if (data != null && data.body != null) {
          this.totalBudget = 0
          originList = data.body
          originList.forEach(origin => {
            this.totalBudget += origin.total
          })
          this.isLoading = false
        } else {
          this.isLoading = false
        }
      },
      error: (error: any) => {
        this.errors = error?.message || 'An unexpected error occurred'
        this.isLoading = false
      }
    })
  }

  getAllTransaction(page: number, limit: number) {

    this.isLoading = true

    this.httpTransactionProvider.getAllTransactionByUserId(page, limit).subscribe({
      next: (data: ApiTransactionResponseList) => {
        this.handleFilteredResponse(data)
      },
      error: (error: any) => {
        this.errors = error?.message || 'An unexpected error occurred'
        this.isLoading = false
      }
    })
  }

  AddTransaction() {
    this.router.navigate(['AddTransaction'])
  }

  pageChange(event: number) {
    this.page = event

    if (this.isFilterActive) {
      this.loadFilteredData(event)
    } else {
      this.getAllTransaction(event, this.limit)
    }
  }

  deleteTransaction(transaction: TransactionResponse) {

    this.httpTransactionProvider.deleteTransaction(transaction._id).subscribe({
      next:(data: ApiTransactionResponse) => {
        if (data != null) {
          this.getAllOrigin()
          if (this.isFilterActive) {
            this.loadFilteredData(this.page)
          } else {
            this.getAllTransaction(this.page, this.limit)
          }
        }
      },
      error: (error: any) => {
        this.errors = error?.message || 'An unexpected error occurred'
      }
    })
  }

  toggleFilter() {
    this.filterVisible = !this.filterVisible
  }

  onFilterTypeChange() {
    this.selectedYear = new Date().getFullYear()
    this.selectedMonth = ""
    this.selectedSubject = ""
    this.selectedPersonBusiness = ""
  }

  applyFilter() {

    this.isLoading = true
    this.page = 1
    this.loadFilteredData(this.page)
    
  }

  loadFilteredData(page: number) {

    this.isFilterActive = true

    if (this.selectedFilterType === 'date') {
      this.loadFilteredByDate(page)
    } else if (this.selectedFilterType === 'subject') {
      this.loadFilteredBySubject(page)
    }
  }

  loadFilteredByDate(page: number) {

    let selectedMonthKey = this.months.get(this.selectedMonth) ?? 0

    this.httpTransactionProvider.getAllTransactionByDate(
      page, 
      this.limit, 
      this.selectedYear, 
      selectedMonthKey).subscribe({
        next: (data: ApiTransactionResponseList) => {
          this.handleFilteredResponse(data)
        },
        error: err => {
          this.errors = err?.message || 'An unexpected error occurred'
          this.isLoading = false
        }
      }
    )
  }

  loadFilteredBySubject(page: number) {

    this.httpTransactionProvider.getAllTransactionBySubject(
      page,
      this.limit,
      this.selectedSubject,
      this.selectedPersonBusiness).subscribe({
        next: (data: ApiTransactionResponseList) => {
          this.handleFilteredResponse(data)
        },
        error: err => {
          this.errors = err?.message || 'An unexpected error occurred'
          this.isLoading = false
        }
      })
  }

  handleFilteredResponse(data: ApiTransactionResponseList) {
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
  }

  clearFilter() {

    this.selectedYear = new Date().getFullYear()
    this.selectedMonth = ""
    this.selectedSubject = ""
    this.selectedPersonBusiness = ""
    this.selectedFilterType = "date"
    this.isFilterActive = false
    this.page = 1
    
    this.filterVisible = false

    this.getAllTransaction(this.page, this.limit)
  }

  getYearsArray(startYear: number, endYear: number): number[] {
    const years: number[] = [];

    for (let i = startYear; i <= endYear; i++) {
      years.push(i)
    }

    return years
  }

}
