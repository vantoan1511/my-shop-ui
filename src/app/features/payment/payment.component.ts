import {Component, OnInit} from '@angular/core';
import {PaymentQuery, PaymentStatusDescriptions} from "../../types/payment.type";
import {PaymentService} from "../../services/payment.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {switchMap, tap} from "rxjs";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CurrencyPipe, DatePipe} from "@angular/common";
import {CartService} from "../../services/cart.service";
import {AlertService} from "../../services/alert.service";

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    TranslateModule,
    RouterLink,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  queryParams: PaymentQuery | null = null;

  constructor(
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private cartService: CartService,
    private alertService: AlertService
  ) {
    this.translate.setDefaultLang("vi")
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      tap(() => console.log(this.queryParams)),
      switchMap((params) => {
        this.queryParams = params as PaymentQuery;
        return this.paymentService.saveTransaction(this.queryParams)
      }),
    ).subscribe((transaction) => {
      if (transaction.status === 'SUCCESS') {
        this.cartService.clearCart().subscribe({
          next: () => this.translate.get("PLACED_ORDER_SUCCESS").subscribe((value) => this.alertService.showSuccessToast(value))
        });
      }
    });
  }

  formatAmount(amountString: string) {
    const amountNumeric = parseInt(amountString);
    return amountNumeric / 100;
  }

  formatDateString(dateString: string) {
    const year = +dateString.substring(0, 4);
    const month = +dateString.substring(4, 6) - 1;
    const day = +dateString.substring(6, 8);
    const hour = +dateString.substring(8, 10);
    const minute = +dateString.substring(10, 12);
    const second = +dateString.substring(12, 14);
    return new Date(year, month, day, hour, minute, second);
  }

  protected readonly PaymentStatusDescriptions = PaymentStatusDescriptions;
}
