import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private BASE_URL = environment.PAYMENT_SERVICE_API;

  constructor(
    private http: HttpClient
  ) {
  }

  getPaymentUrl(orderId: number) {
    return this.http.post<GetPaymentUrlResponse>(`${this.BASE_URL}/payments/process`, {orderId})
  }
}

interface GetPaymentUrlResponse {
  processUrl: string
}
