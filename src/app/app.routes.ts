import {Routes} from '@angular/router';
import {AdminComponent} from './features/admin/admin.component';
import {DashboardComponent} from './features/admin/dashboard/dashboard.component';
import {OrdersComponent} from './features/admin/orders/orders.component';
import {AdminProductsComponent} from './features/admin/products/admin-products.component';
import {ProfileAdminComponent} from './features/admin/profile/profile.component';
import {DetailsComponent} from './features/admin/users/userdetails/userdetails.component';
import {UsersComponent} from './features/admin/users/users.component';
import {HomeComponent} from './features/home/home.component';
import {ProductDetailsComponent} from './features/product-details/product-details.component';
import {ProductListComponent} from './features/product-list/product-list.component';
import {ProfileComponent} from './features/user/profile/profile.component';
import {UserComponent} from './features/user/user.component';
import {authGuard} from './guard/auth.guard';
import {Role} from './types/role.type';
import {AdminProductDetailsComponent} from "./features/admin/products/productdetails/admin-product-details.component";

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
                path: 'products/:id',
                component: ProductDetailsComponent,
            },
            {
                path: 'users',
                component: UserComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'profile',
                        pathMatch: 'full',
                    },
                    {
                        path: 'profile',
                        component: ProfileComponent,
                    },
                ],
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
                component: AdminProductsComponent,
            },
            {
                path: 'products/:slug',
                component: AdminProductDetailsComponent,
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
            {
                path: 'profile',
                component: ProfileAdminComponent,
            },
        ],
    },
];
