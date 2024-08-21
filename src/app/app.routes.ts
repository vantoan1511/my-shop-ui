import {Routes} from '@angular/router';
import {HomeComponent} from "./feature/home/home.component";
import {ProductDetailsComponent} from "./feature/products/product-details/product-details.component";
import {authGuard} from "./core/guard/auth.guard";
import {UserListComponent} from "./feature/admin/users/user-list/user-list.component";
import {ForbiddenComponent} from "./core/components/forbidden/forbidden.component";
import {PageNotFoundComponent} from "./core/components/page-not-found/page-not-found.component";
import {ProductListComponent} from "./feature/products/product-list/product-list.component";
import {AdminHomeComponent} from "./feature/admin/home/admin-home.component";
import {RoleEnum} from "./types/role.enum";
import {CartComponent} from "./feature/cart/cart.component";

export const routes: Routes = [
    {
        path: 'admin',
        component: AdminHomeComponent,
        canActivate: [authGuard],
        data: {
            expectedRoles: [RoleEnum.ADMIN]
        },
        children: [
            {
                path: '',
                redirectTo: 'users',
                pathMatch: 'full'
            },
            {
                path: 'users',
                title: 'User Management - Shopbee Admin Dashboard',
                component: UserListComponent,
            },
            {
                path: '**',
                component: PageNotFoundComponent
            }
        ]
    },
    {

        path: '', component: HomeComponent,
        title: 'Shopbee',
        children: [
            {
                path: '',
                component: ProductListComponent,
            },
            {
                path: 'cart',
                title: 'Cart',
                component: CartComponent,
            },
            {
                path: 'products/:id',
                component: ProductDetailsComponent,
            },
            {
                path: 'forbidden', component: ForbiddenComponent,
            },
            {
                path: '**',
                component: PageNotFoundComponent
            }
        ]
    },

];
