import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { Router, RouterLink } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FormsModule } from '@angular/forms';
import { OriginResponse } from '../../interface/origin.models';
import { HttpOriginProviderService } from '../../service/http-origin-provider.service';

@Component({
  selector: 'app-view-origin',
  imports: [RouterLink, CommonModule, SweetAlert2Module, CommonModule, LoadingComponent, FormsModule],
  templateUrl: './view-origin.component.html',
  styleUrl: './view-origin.component.css'
})
export class ViewOriginComponent {

  isLoading: boolean = true
  errors: string = ""
  originList: OriginResponse[] = []
  
  router = inject(Router)
  httpProvider = inject(HttpOriginProviderService)

  constructor() {
    this.getAllOrigin()
  }

  async getAllOrigin() {

    this.isLoading = true

    this.httpProvider.getAllOriginByUserId().subscribe({
      next: (data: any) => {
        if (data != null && data.body != null) {
          this.originList = data.body
          this.isLoading = false
        } else {
          this.originList = []
          this.isLoading = false
        }
      },
      error: (error: any) => {
        this.errors = error
        this.isLoading = false
      } 
    })
  }

  AddOrigin() {
    this.router.navigate(['AddOrigin'])
  }

  deleteOrigin(origin: OriginResponse) {

    this.httpProvider.deleteOrigin(origin._id).subscribe({
      next: (data: any) => {
        if (data != null) {
          this.getAllOrigin()
        }
      },
      error: (error: any) => {
        this.errors = error
      }
    })
  }

}
