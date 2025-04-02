import { Injectable } from '@angular/core';
import { WebApiService } from './web-api.service';

var apiUrl = "http://localhost:8080/transactions"

@Injectable({
  providedIn: 'root'
})
export class HttpProviderService {

  constructor(private webApiService: WebApiService) { }

  public getAllTransaction() {
    return this.webApiService.get(apiUrl);
  }

  public getTransactionById(id: number) {
    return this.webApiService.get(apiUrl + "/" + id);
  }

  public addTransaction(model: any) {
    return this.webApiService.post(apiUrl, model);
  }

  public updateTransaction(model: any) {
    return this.webApiService.put(apiUrl + "/" + model.id, model);
  }

  public deleteTransaction(id: number) {
    return this.webApiService.delete(apiUrl + "/" + id);
  }
}
