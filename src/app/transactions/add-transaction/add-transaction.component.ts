import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpTransactionProviderService } from '../../service/http-transaction-provider.service';
import { TransactionRequest } from '../../interface/transaction.models';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/auth/auth.service';
import { HttpOriginProviderService } from '../../service/http-origin-provider.service';
import { ApiOriginResponseList, OriginResponse } from '../../interface/origin.models';
import { ErrorAlertComponent } from '../../shared/error-alert/error-alert.component';

@Component({
  selector: 'app-add-transaction',
  imports: [ReactiveFormsModule, RouterLink, CommonModule, ErrorAlertComponent],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.css'
})
export class AddTransactionComponent {

  private readonly formBuilder = inject(FormBuilder)
  httpTransactionProvider = inject(HttpTransactionProviderService)
  httpOriginProvider = inject(HttpOriginProviderService)
  router = inject(Router)
  authService = inject(AuthService)

  isSubmitted: boolean = false
  errors: string = ""
  originMap = new Map<string, string>()
  originList: string[] = []

  transactionTypes: string[] = ["Entrada", "Salida", "Deuda", "Intercambio"]
  inputTransactionSubjects: string[] = ["Salario", "Pago", "Regalo", "Inversión"]
  outputTransactionSubjects: string[] = ["Comida", "Transporte", "Compras", "Facturas", "Entretenimiento", "Salud", "Educación", "Viajes", "Otros"]
  debtTransactionSubjects: string[] = ["Presté dinero", "Me prestaron dinero"]
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
  }

  form = this.formBuilder.group({
    amount: [0, Validators.min(0.01)],
    type: [''],
    subject: [''],
    person_business: [''],
    output_category: [''],
    description: [''],
    origin_id: [''],
    created: [''],
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

  addTransaction() {
    this.isSubmitted = true

    if (this.form.invalid)  return

    let transaction = this.form.value as TransactionRequest;
    let formValues = this.form.value

    transaction.type = formValues.type == "Entrada" ? "Income" : formValues.type == "Salida" ? "Output" : "Exchange"
    transaction.user_id = this.authService.getCurrentUserValue()?._id!
    transaction.origin_id = this.originMap.get(formValues.origin_id || "") || ""
    
    this.httpTransactionProvider.saveTransaction(transaction).subscribe({
      next: () => {
        this.router.navigate(['Home'])
      },
      error: err => {
        this.errors = err?.message || 'An unexpected error occurred'
      }
    })
  }

}
