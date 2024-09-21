import { Routes } from '@angular/router';
import { AdminComponent } from './features/admin/admin.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { OrdersComponent } from './features/admin/orders/orders.component';
import { ProductsComponent } from './features/admin/products/products.component';
import { ProfileComponent } from './features/admin/profile/profile.component';
import { DetailsComponent } from './features/admin/users/userdetails/userdetails.component';
import { UsersComponent } from './features/admin/users/users.component';
import { HomeComponent } from './features/home/home.component';
import { ProductDetailsComponent } from './features/product-details/product-details.component';
import { ProductListComponent } from './features/product-list/product-list.component';
import { authGuard } from './guard/auth.guard';
import { Role } from './types/role.type';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: ProductListComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'products/:id',
        component: ProductDetailsComponent,
      },
    ],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
    data: {
      expectedRoles: [Role.ADMIN],
    },
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
      {
        path: 'users/:id',
        component: DetailsComponent,
      },
    ],
  },
];
