import {Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ProductDetailsComponent} from "./product-details/product-details.component";
import {authGuard} from "./auth.guard";

export const routes: Routes = [
    {
        path: '', component: HomeComponent,
    },
    {
        path: 'products/:id', component: ProductDetailsComponent, canActivate: [authGuard],
    }
];
