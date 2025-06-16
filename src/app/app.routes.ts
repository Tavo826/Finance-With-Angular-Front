import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddTransactionComponent } from './transactions/add-transaction/add-transaction.component';
import { ViewTransactionComponent } from './transactions/view-transaction/view-transaction.component';
import { EditTransactionComponent } from './transactions/edit-transaction/edit-transaction.component';
import { LoginComponent } from './users/login/login.component';
import { RegisterComponent } from './users/register/register.component';
import { AuthGuard, NoAuthGuard } from './shared/auth/auth.guard';
import { ViewUserComponent } from './users/view-user/view-user.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { EditOriginComponent } from './origins/edit-origin/edit-origin.component';
import { ViewOriginComponent } from './origins/view-origin/view-origin.component';
import { AddOriginComponent } from './origins/add-origin/add-origin.component';

export const routes: Routes = [
    { path: '', redirectTo: 'Login', pathMatch: 'full' },
    { path: 'Login', component: LoginComponent, canActivate: [NoAuthGuard] },
    { path: 'Register', component: RegisterComponent, canActivate: [NoAuthGuard] },
    { path: 'ViewUser', component: ViewUserComponent, canActivate: [AuthGuard] },
    { path: 'EditUser/:userId', component: EditUserComponent, canActivate: [AuthGuard] },
    { path: 'Home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'ViewTransaction/:transactionId', component: ViewTransactionComponent, canActivate: [AuthGuard] },
    { path: 'AddTransaction', component: AddTransactionComponent, canActivate: [AuthGuard] },
    { path: 'EditTransaction/:transactionId', component: EditTransactionComponent, canActivate: [AuthGuard] },
    { path: 'ViewOrigin', component: ViewOriginComponent, canActivate: [AuthGuard] },
    { path: 'AddOrigin', component: AddOriginComponent, canActivate: [AuthGuard] },
    { path: 'EditOrigin/:originId', component: EditOriginComponent, canActivate: [AuthGuard] },
    { path: "**", redirectTo: 'Login'}
];
