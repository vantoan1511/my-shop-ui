import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CreateOrderRequest, Order} from "../types/createOrderRequest";
import {PageRequest} from "../types/page-request.type";
import {PagedResponse} from "../types/response.type";

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    protected BASE_URL = environment.ORDER_SERVICE_API;

    constructor(private http: HttpClient) {
    }

    createOrder(createOrderRequest: CreateOrderRequest) {
        return this.http.post<Order>(`${this.BASE_URL}/orders`, createOrderRequest);
    }

    getOrders(productSlug: string, pageRequest: PageRequest) {
        return this.http.get<PagedResponse<Order>>(`${this.BASE_URL}/orders/`, {
            params: {
                productSlug,
                ...pageRequest
            }
        })
    }

}
