import {Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ProductDetailsComponent} from "./product-details/product-details.component";
import {authGuard} from "./auth.guard";
import {UsersComponent} from "./users/users.component";

export const routes: Routes = [
    {
        path: '', component: HomeComponent,
    },
    {
        path: 'products/:id',
        component: ProductDetailsComponent,
        canActivate: [authGuard],
        data: {expectedRoles: ['admin']}
    },
    {
        path: 'users',
        component: UsersComponent,
        canActivate: [authGuard],
        data: {expectedRoles: ['admin']}
    },
];
