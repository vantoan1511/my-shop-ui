import { Routes } from '@angular/router';
import { AdminComponent } from './features/admin/admin.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { OrdersComponent } from './features/admin/orders/orders.component';
import { ProductsComponent } from './features/admin/products/products.component';
import { UsersComponent } from './features/admin/users/users.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'orders',
        component: OrdersComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
    ],
  },
];
