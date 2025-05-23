import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { ViewTransactionComponent } from './view-transaction/view-transaction.component';
import { EditTransactionComponent } from './edit-transaction/edit-transaction.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard, NoAuthGuard } from './shared/auth/auth.guard';
import { ViewUserComponent } from './view-user/view-user.component';

export const routes: Routes = [
    { path: '', redirectTo: 'Login', pathMatch: 'full' },
    { path: 'Login', component: LoginComponent, canActivate: [NoAuthGuard] },
    { path: 'Register', component: RegisterComponent, canActivate: [NoAuthGuard] },
    { path: 'ViewUser', component: ViewUserComponent, canActivate: [AuthGuard] },
    { path: 'Home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'ViewTransaction/:transactionId', component: ViewTransactionComponent, canActivate: [AuthGuard] },
    { path: 'AddTransaction', component: AddTransactionComponent, canActivate: [AuthGuard] },
    { path: 'EditTransaction/:transactionId', component: EditTransactionComponent, canActivate: [AuthGuard] },
    { path: "**", redirectTo: 'Login'}
];
