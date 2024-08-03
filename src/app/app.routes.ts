import {Routes} from '@angular/router';
import {HomeComponent} from "./feature/home/home.component";
import {ProductDetailsComponent} from "./feature/product-details/product-details.component";
import {authGuard} from "./guard/auth.guard";
import {UserListComponent} from "./feature/user-list/user-list.component";
import {ForbiddenComponent} from "./feature/forbidden/forbidden.component";
import {PageNotFoundComponent} from "./feature/page-not-found/page-not-found.component";
import {ProductListComponent} from "./feature/product-list/product-list.component";
import {AdminHomeComponent} from "./feature/admin-home/admin-home.component";
import {Role} from "./shared/model/role";
import {CartComponent} from "./feature/cart/cart.component";

export const routes: Routes = [
    {
        path: 'admin',
        component: AdminHomeComponent,
        canActivate: [authGuard],
        data: {
            expectedRoles: [Role.ADMIN]
        },
        children: [
            {
                path: '',
                redirectTo: 'users',
                pathMatch: 'full'
            },
            {
                path: 'users',
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
        children: [
            {
                path: '',
                component: ProductListComponent,
            },
            {
                path: 'cart',
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
