import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Order, OrderType} from "../types/order.type";
import {PageRequest} from "../types/page-request.type";
import {PagedResponse} from "../types/response.type";
import {Sort} from "../types/sort.type";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  protected BASE_URL = environment.ORDER_SERVICE_API;

  constructor(private http: HttpClient) {
  }

  createOrder(createOrderRequest: OrderType) {
    return this.http.post<Order>(`${this.BASE_URL}/orders`, createOrderRequest);
  }

  getOrders(filter: Filter, pageRequest: PageRequest, sort: Sort) {
    return this.http.get<PagedResponse<Order>>(`${this.BASE_URL}/orders/`, {
      params: {
        ...filter,
        ...pageRequest,
        ...sort
      }
    })
  }

  getOrderById(orderId: number) {
    return this.http.get<Order>(`${this.BASE_URL}/orders/${orderId}`)
  }

  cancelOrder(orderId: number) {
    return this.http.patch(`${this.BASE_URL}/orders/${orderId}/cancel`, {})
  }

  changeOrderStatus(status: string, orderId: number) {
    return this.http.patch(`${this.BASE_URL}/orders/${orderId}`, {
      status,
    })
  }

}

export interface Filter {
  keyword?: string;
  status?: string;
  productSlug?: string;
}
