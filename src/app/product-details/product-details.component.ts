import {Component, Input} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faCartShopping, faMinus, faPlus, faStar} from "@fortawesome/free-solid-svg-icons";
import {Product} from "../product-list/product";
import {FormsModule} from "@angular/forms";
import {CurrencyPipe, NgForOf} from "@angular/common";
import {ProductService} from "../product-list/product.service";
import {ActivatedRoute} from "@angular/router";
import {switchMap} from "rxjs";

@Component({
    selector: 'app-product-details',
    standalone: true,
    imports: [
        FaIconComponent,
        FormsModule,
        NgForOf,
        CurrencyPipe
    ],
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
    @Input() product!: Product;

    quantity: number = 1;

    constructor(protected readonly productService: ProductService, protected route: ActivatedRoute) {
        this.route.params.pipe(
            switchMap(params => this.productService.fetchById(+params['id']))
        ).subscribe(product => {
            if (product) this.product = product;
        })
    }

    decreaseQuantity(): void {
        if (this.quantity > 1) this.quantity--;
    }

    increaseQuantity(): void {
        this.quantity++;
    }

    protected readonly faStar = faStar;
    protected readonly faCart = faCartShopping;
    protected readonly faMinus = faMinus;
    protected readonly faPlus = faPlus;
}
