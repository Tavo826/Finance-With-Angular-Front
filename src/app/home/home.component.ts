import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpTransactionProviderService } from '../service/http-transaction-provider.service';
import { TransactionResponse } from '../interface/transaction.models';
import { CommonModule } from '@angular/common';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { LoadingComponent } from "../shared/loading/loading.component";
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, SweetAlert2Module, LoadingComponent, NgbPaginationModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  isLoading: boolean = true
  errors: string = ""
  transactionList: TransactionResponse[] = []
  totalTransactions = 0
  page = 1
  limit = 20
  years: number[] = []
  filterVisible = false
  selectedYear!: number
  selectedMonth!: string
  months = new Map<string, number>()
  isFilterActive = false

  router = inject(Router)
  httpProvider = inject(HttpTransactionProviderService)

  constructor() {

    const currentYear = new Date().getFullYear()
    this.initializeMonths()
    this.years = this.getYearsArray(currentYear, currentYear)
    this.selectedYear = currentYear
    this.selectedMonth = ""
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
        this.errors = error
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

    this.httpProvider.deleteTransaction(transaction._id).subscribe({
      next:(data: any) => {
        if (data != null) {
          if (this.isFilterActive) {
            this.loadFilteredData(this.page)
          } else {
            this.getAllTransaction(this.page, this.limit)
          }
        }
      },
      error: (error: any) => {}
    })
  }

  toggleFilter() {
    this.filterVisible = !this.filterVisible
  }

  applyFilter() {

    this.isLoading = true
    this.page = 1
    this.loadFilteredData(this.page)
    
  }

  loadFilteredData(page: number) {

    let selectedMonthKey = this.months.get(this.selectedMonth) ?? 0

    this.isFilterActive = true

    this.httpProvider.getFilteredTransaction(
      page, 
      this.limit, 
      this.selectedYear, 
      selectedMonthKey).subscribe({
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
        error: err => {
          this.errors = err;
          this.isLoading = false
        }
      })
  }

  clearFilter() {

    const currentYear = new Date().getFullYear()
    this.selectedYear = currentYear
    this.selectedMonth = ""
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

  initializeMonths(): Map<string, number> {

    this.months.set("January", 1)
    this.months.set("February", 2)
    this.months.set("March", 3)
    this.months.set("April", 4)
    this.months.set("May", 5)
    this.months.set("June", 6)
    this.months.set("July", 7)
    this.months.set("August", 8)
    this.months.set("September", 9)
    this.months.set("October", 10)
    this.months.set("November", 11)
    this.months.set("December", 12)
    return this.months
  }

}
