import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { ViewTransactionComponent } from './view-transaction/view-transaction.component';
import { EditTransactionComponent } from './edit-transaction/edit-transaction.component';

export const routes: Routes = [
    { path: '', redirectTo: 'Home', pathMatch: 'full' },
    { path: 'Home', component: HomeComponent },
    { path: 'ViewTransaction/:transactionId', component: ViewTransactionComponent},
    { path: 'AddTransaction', component: AddTransactionComponent },
    { path: 'EditTransaction/:transactionId', component: EditTransactionComponent }
];
