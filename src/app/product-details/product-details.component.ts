import {Component, Input} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faCartShopping, faMinus, faPlus, faStar} from "@fortawesome/free-solid-svg-icons";
import {Product} from "../product-list/product";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
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
        CurrencyPipe,
        ReactiveFormsModule
    ],
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
    @Input() product!: Product;

    quantity = new FormControl(1);
    currentMainImage: string = '';

    constructor(protected readonly productService: ProductService, protected route: ActivatedRoute) {
        this.route.params.pipe(
            switchMap(params => this.productService.fetchById(+params['id']))
        ).subscribe(product => {
            if (product) {
                this.product = product;
                this.currentMainImage = product.mainImage;
            }
        })
    }

    decreaseQuantity(): void {
        if (this.quantity.value && this.quantity.value > 1) {
            const currentQuantity = this.quantity.value;
            this.quantity.setValue(currentQuantity - 1);
        }
    }

    increaseQuantity(): void {
        const currentQuantity = this.quantity.value || 1;
        this.quantity.setValue(currentQuantity + 1);
    }

    onChangedThumbnail(index: number) {
        this.currentMainImage = this.product.thumbnails[index];
    }

    validateQuantity() {
        const currentQuantity = this.quantity.value;
        if (currentQuantity == null) {
            this.quantity.setValue(1)
        } else {
            const newQuantity = Math.floor(currentQuantity) < 1 ? 1 : Math.floor(currentQuantity);
            this.quantity.setValue(newQuantity);
        }
    }

    protected readonly faStar = faStar;
    protected readonly faCart = faCartShopping;
    protected readonly faMinus = faMinus;
    protected readonly faPlus = faPlus;
}
