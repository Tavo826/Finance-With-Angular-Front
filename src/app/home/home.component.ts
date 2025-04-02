import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Type } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpProviderService } from '../Service/http-provider.service';


@Component({
  selector: 'ng-modal-confirm',
  template: `
    <div class="modal-header">
      <h5 class="modal-title" id="modal-title">Delete Confirmation</h5>
      <button type="button" class="btn-close" aria-label="Close button" aria-describedby="modal-title" (click)="modal.dismiss('Cross click')">
        <span aria-hidden="true">x</span>
      </button>
    </div>
    <div class="modal-body">
      <p>Are you sure you want to delete?</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">Cancel</button>
      <button type="button" ngbAutofocus class="btn btn-success" (click)="modal.close('Ok click')">Ok</button>
    </div>
  `,
})

export class NgModalConfirm {
  constructor(public modal: NgbActiveModal) {}
}

const MODALS: { [name: string]: Type<any> } = {
  deleteModal: NgModalConfirm,
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  
  closeResult = ''
  transactionList: any = []

  constructor(
    private router: Router, 
    private modalService: NgbModal, 
    private toastr: ToastrService,
    private httpProvider: HttpProviderService
  ) { }

  ngOnInit(): void {
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

  deleteTransactionConfirmation(transaction: any) {
    this.modalService.open(MODALS['deleteModal'],
      {
        ariaLabelledBy: 'modal-basic-title',
      }).result.then((result) => {
        this.deleteTransaction(transaction)
      },
        (reason) => {})
  }

  deleteTransaction(transaction: any) {
    this.httpProvider.deleteTransaction(transaction.id).subscribe({
      next:(data: any) => {
        if (data != null && data.body != null) {
          var resultData = data.body
          if (resultData != null && resultData.isSuccess) {
            this.toastr.success(resultData.message)
            this.getAllTransaction()
          }
        }
      },
      error: (error: any) => {}
    })
  }

}
