import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AddToCartRequest, Cart} from "../types/cart.type";
import {PageRequest} from "../types/page-request.type";
import {PagedResponse} from "../types/response.type";
import {BehaviorSubject, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private totalCartsSubject = new BehaviorSubject<number>(0);
  totalCarts$ = this.totalCartsSubject.asObservable();

  protected BASE_URL = environment.CART_SERVICE_API;

  constructor(private http: HttpClient) {
    this.getCartCount()
  }

  getCartCount() {
    this.getCart({page: 1, size: 1}).subscribe(({totalItems}) => this.totalCartsSubject.next(totalItems));
  }

  getCart(pageRequest: PageRequest) {
    return this.http.get<PagedResponse<Cart>>(`${this.BASE_URL}/carts`, {
      params: {...pageRequest}
    })
  }

  addToCart(addToCartRequest: AddToCartRequest) {
    return this.http.post<Cart>(`${this.BASE_URL}/carts/add`, addToCartRequest).pipe(
      tap(() => this.getCartCount())
    );
  }

  removeCartItem(cartId: number) {
    return this.http.delete(`${this.BASE_URL}/carts/${cartId}`).pipe(
      tap(() => this.getCartCount())
    );
  }

  clearCart() {
    return this.http.delete(`${this.BASE_URL}/carts`).pipe(
      tap(() => this.getCartCount())
    );
  }

  updateQuantity(cartId: number, quantity: number) {
    return this.http.put(`${this.BASE_URL}/carts/${cartId}`, {quantity});
  }
}
