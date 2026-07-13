import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpTransactionProviderService } from '../../service/http-transaction-provider.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiTransactionResponse, TransactionRequest } from '../../interface/transaction.models';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../shared/loading/loading.component";
import { ErrorAlertComponent } from '../../shared/error-alert/error-alert.component';
import { AuthService } from '../../shared/auth/auth.service';
import { ApiOriginResponseList, OriginResponse } from '../../interface/origin.models';
import { HttpOriginProviderService } from '../../service/http-origin-provider.service';

@Component({
  selector: 'app-edit-transaction',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, LoadingComponent, ErrorAlertComponent],
  templateUrl: './edit-transaction.component.html',
  styleUrl: './edit-transaction.component.css'
})
export class EditTransactionComponent {

  private readonly formBuilder = inject(FormBuilder)
  httpTransactionProvider = inject(HttpTransactionProviderService)
  httpOriginProvider = inject(HttpOriginProviderService)
  router = inject(Router)
  route = inject(ActivatedRoute)
  authService = inject(AuthService)

  isSubmitted = false
  errors: string = ""
  transactionId = this.route.snapshot.params['transactionId']
  editTransaction: any
  originMap = new Map<string, string>()
  originList: string[] = []

  transactionTypes: string[] = ["Entrada", "Salida", "Intercambio"]
  inputTransactionSubjects: string[] = ["Salario", "Regalo", "Préstamo", "Inversión"]
  outputTransactionSubjects: string[] = ["Comida", "Transporte", "Compras", "Facturas", "Entretenimiento", "Salud", "Educación", "Viajes", "Otros"]
  interchangeTransactionSubjects: string[] = ["Inversión", "Retiro"]
  outputTransactionCategories: string[] = ["Urgente e importante (Periódico)", "Importante pero no urgente (Periódico)", "Urgente pero no importante (No periódico)", "Ni urgente ni importante"]
  outputTransactionCategoryInfo: { title: string, colorClass: string, description: string, examples: string[] }[] = [
    {
      title: "Urgente e importante (Periódico)",
      colorClass: "danger",
      description: "Gastos recurrentes que no se pueden posponer y son esenciales para tu estabilidad.",
      examples: ["Renta o hipoteca", "Servicios (luz, agua, gas, internet)", "Mercado", "Seguro médico", "Transporte"]
    },
    {
      title: "Importante pero no urgente (Periódico)",
      colorClass: "warning",
      description: "Gastos recurrentes que aportan a tu bienestar a largo plazo, pero tienen flexibilidad en el tiempo.",
      examples: ["Corte de cabello", "Membresía de gimnasio", "Cursos o educación", "Fondo de emergencia", "Gasolina"]
    },
    {
      title: "Urgente pero no importante (No periódico)",
      colorClass: "info",
      description: "Gastos puntuales que requieren atención inmediata, pero que no aportan mucho valor a largo plazo.",
      examples: ["Reparación urgente del carro", "Reposición de un objeto perdido", "Envío exprés", "Multa o cargo por atraso"]
    },
    {
      title: "Ni urgente ni importante",
      colorClass: "secondary",
      description: "Gastos discrecionales que podrías eliminar sin mayor impacto en tu vida.",
      examples: ["Compras por impulso", "Comida a domicilio extra", "Suscripciones sin usar", "Compras de lujo no planeadas"]
    }
  ]

  constructor() {
    this.getOriginsByUserId()
    this.getTransactionDetailById()
  }

  form = this.formBuilder.group({
    amount: [0, Validators.min(0.01)],
    type: [''],
    subject: [''],
    output_category: [''],
    person_business: [''],
    description: [''],
    origin: [''],
    created: [''],
    created_at: [''],
    updated_at: [''],
  });

  getOriginsByUserId() {

    let originResponse: OriginResponse[]

    this.httpOriginProvider.getAllOriginByUserId().subscribe({
      next: (data: ApiOriginResponseList) => {
        if (data != null && data.body != null) {
          originResponse = data.body
          originResponse.forEach(origin => {
            this.originMap.set(origin.name, origin._id)
            this.originList.push(origin.name)
          })
        }
      },
      error: (error: any) => {
        this.errors = error?.message || 'An unexpected error occurred'
      } 
    })
  }

  getTransactionDetailById() {

    this.httpTransactionProvider.getTransactionById(this.transactionId).subscribe({
      next: (data: ApiTransactionResponse) => {
        if (data != null && data.body != null) {
          var resultData = data.body

          const formData = {
            ...resultData,
            origin: resultData.origin?.name
          }

          this.form.patchValue(formData)
        }
      },
      error: (error: any) => {
        this.errors = error?.message || 'An unexpected error occurred'
      }
    })
  }

  EditTransaction(isValid: boolean) {

    this.isSubmitted = true

    if (this.form.invalid)  return
    
    if (isValid) {

      let transaction = this.form.value as TransactionRequest;
      let formValues = this.form.value

      transaction.user_id = this.authService.getCurrentUserValue()?._id!
      transaction.origin_id = this.originMap.get(formValues.origin || "") || ""

      this.httpTransactionProvider.updateTransaction(this.transactionId, transaction).subscribe(() => {
        this.router.navigate(['Home'])
      })
    }
  }

}
