import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {
  GetPaymentUrlResponse,
  PaymentQuery,
  SaleReportRequest,
  SaleReportResponse,
  Transaction
} from "../types/payment.type";

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

  saveTransaction(paymentQuery: PaymentQuery) {
    return this.http.post<Transaction>(`${this.BASE_URL}/payments/vnpay-return`, paymentQuery)
  }

  getSaleReport(saleReportRequest: SaleReportRequest) {
    return this.http.get<SaleReportResponse>(`${this.BASE_URL}/payments/report`, {
      params: {...saleReportRequest}
    })
  }
}
