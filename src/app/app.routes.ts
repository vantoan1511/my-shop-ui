import {Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ProductDetailsComponent} from "./product-details/product-details.component";
import {authGuard} from "./auth.guard";
import {UsersComponent} from "./users/users.component";
import {ForbiddenComponent} from "./forbidden/forbidden.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {ProductListComponent} from "./product-list/product-list.component";
import {AdminHomeComponent} from "./admin-home/admin-home.component";
import {Role} from "./role";
import {CartComponent} from "./cart/cart.component";

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
                component: UsersComponent,
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
