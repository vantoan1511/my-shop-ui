import {Component} from '@angular/core';
import {FilterComponent} from "../../shared/component/filter/filter.component";
import {delay, Observable, of} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {ProductService} from "../product-list/product.service";
import {Product} from "../product-list/product";

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [
        FilterComponent,
        AsyncPipe
    ],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss'
})
export class CartComponent {

    products$: Observable<Product[]>;
    defaultIds$?: Observable<number[]>;

    constructor(protected productService: ProductService) {
        this.products$ = this.fetchProducts();
        this.defaultIds$ = this.fetchDefault();
    }

    fetchDefault() {
        return of([1, 2, 3]).pipe(delay(1000));
    }

    fetchProducts() {
        return this.productService.fetchAll().pipe(delay(500));
    }
}
