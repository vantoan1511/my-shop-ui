import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AddToCartRequest, Cart, CartItem} from "../types/cart.type";
import {PageRequest} from "../types/page-request.type";
import {PagedResponse} from "../types/response.type";

@Injectable({
    providedIn: 'root'
})
export class CartService {

    protected BASE_URL = environment.CART_SERVICE_API;

    constructor(private http: HttpClient) {
    }

    getCart(pageRequest: PageRequest) {
        return this.http.get<PagedResponse<Cart>>(`${this.BASE_URL}/carts`, {
            params: {...pageRequest}
        })
    }

    addToCart(addToCartRequest: AddToCartRequest) {
        return this.http.post<Cart>(`${this.BASE_URL}/carts/add`, addToCartRequest);
    }

    removeCartItem(cartId: number) {
        return this.http.delete(`${this.BASE_URL}/carts/${cartId}`);
    }

    clearCart() {
        return this.http.delete(`${this.BASE_URL}/carts`);
    }

    updateQuantity(cartId: number, quantity: number) {
        return this.http.put(`${this.BASE_URL}/carts/${cartId}`, {quantity});
    }
}
