import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { HomeLayoutComponent } from './layout/home-layout/home-layout.component';
import { LoginComponent } from './login/login.component';
import { BillingComponent } from './components/billing/billing.component';
import { AuthGuard } from './auth/authGuard';
import { ProductsComponent } from './components/products/products.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { ReferalsComponent } from './components/referals/referals.component';
import { UsersComponent } from './components/users/users.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { ClientsComponent } from './components/clients/clients.component';
import { AddClientsComponent } from './components/add-clients/add-clients.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: HomeLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'billing',
        component: BillingComponent,
      },
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'transaction',
        component: TransactionComponent,
      },
      {
        path: 'referals',
        component: ReferalsComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'file-upload',
        component: FileUploadComponent,
      },
      {
        path: 'clients',
        component: ClientsComponent,
      },
      {
        path: 'add-client',
        component: AddClientsComponent,
      },
    ],
  },
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
