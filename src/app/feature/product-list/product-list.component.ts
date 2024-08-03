import {Component} from '@angular/core';
import {ProductCardComponent} from "../../shared/component/product-card/product-card.component";
import {ProductService} from "./product.service";
import {Product} from "./product";

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [
        ProductCardComponent
    ],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.scss'
})
export class ProductListComponent {

    products: Product[] = [];

    constructor(protected productService: ProductService) {
        productService.fetchAll().subscribe((products) => this.products = products);
    }
}
