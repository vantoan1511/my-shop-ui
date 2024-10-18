import {Component} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {CartItem} from "../../types/cart.type";
import {constant} from "../../shared/constant";

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [
        TranslateModule,
        NgIf,
        CurrencyPipe,
        RouterLink,
        FormsModule,
        NgForOf
    ],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss'
})
export class CartComponent {
    cartItems: CartItem[] = [
        {
            quantity: 1,
            product: {
                id: 1,
                name: 'Product 1',
                slug: 'product-1',
                basePrice: 20000000,
                salePrice: 20000000,
                stockQuantity: 10,
                model: {
                    id: 1,
                    name: 'model1',
                    slug: 'model1',
                    brand: {
                        id: 1,
                        name: 'brand',
                        slug: 'brand'
                    }

                },
                category: {
                    id: 1,
                    name: 'cate',
                    slug: 'cate'
                }
            }
        },
        {
            quantity: 1,
            product: {
                id: 2,
                name: 'Product 2',
                slug: 'product-2',
                basePrice: 20000000,
                salePrice: 16000000,
                stockQuantity: 6,
                model: {
                    id: 1,
                    name: 'model1',
                    slug: 'model1',
                    brand: {
                        id: 1,
                        name: 'brand',
                        slug: 'brand'
                    }

                },
                category: {
                    id: 1,
                    name: 'cate',
                    slug: 'cate'
                }
            }
        },
    ];

    constructor(
        private translate: TranslateService
    ) {
        this.translate.setDefaultLang("vi");
    }

    get totalItems(): number {
        return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }

    get totalPrice(): number {
        return this.cartItems.reduce((sum, item) => sum + (item.product.salePrice * item.quantity), 0);
    }

    increaseQuantity(item: CartItem): void {
        if (item.quantity < item.product.stockQuantity) {
            item.quantity++;
        }
    }

    decreaseQuantity(item: CartItem): void {
        if (item.quantity > 1) {
            item.quantity--;
        }
    }

    validateQuantity(item: CartItem): void {
        if (item.quantity < 1) {
            item.quantity = 1;
        } else if (item.quantity > item.product.stockQuantity) {
            item.quantity = item.product.stockQuantity;
        }
    }

    removeFromCart(item: CartItem): void {
        this.cartItems = this.cartItems.filter(cartItem => cartItem.product.id !== item.product.id);
    }

    checkout(): void {
        // Logic for proceeding to checkout
        console.log('Proceed to checkout');
    }

    protected readonly constant = constant;
}
