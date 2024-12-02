import {Component, OnInit} from '@angular/core';
import {CurrencyPipe, DatePipe, NgTemplateOutlet} from "@angular/common";
import {DataTableFooterComponent} from "../../../shared/components/pagination/pagination.component";
import {FormsModule} from "@angular/forms";
import {SortableDirective} from "../../../directives/sortable.directive";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {SortField} from "../../../types/sort.type";
import {Transaction} from "../../../types/payment.type";
import {PagedResponse} from "../../../types/response.type";
import {PaymentService} from "../../../services/payment.service";
import {tap} from "rxjs";
import {OrderService} from "../../../services/order.service";
import {Order} from "../../../types/order.type";
import {TableSkeletonComponent} from "../../../components/table-skeleton/table-skeleton.component";

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CurrencyPipe,
    DataTableFooterComponent,
    DatePipe,
    FormsModule,
    NgTemplateOutlet,
    SortableDirective,
    TranslateModule,
    TableSkeletonComponent
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit {

  loading = false;
  transactions: Transaction[] = [];
  selectedTransaction: Transaction | null = null;
  relatedOrder: Order | null = null;
  page = 0;
  size = 20;
  transactionResponse: PagedResponse<Transaction> | null = null;

  constructor(
    private translateService: TranslateService,
    private paymentService: PaymentService,
    private orderService: OrderService,
  ) {
    this.translateService.setDefaultLang("vi")
  }

  ngOnInit(): void {
    this.getTransactionsNext()
  }

  onClickOnTransaction(transaction: Transaction) {
    this.selectedTransaction = transaction;
    this.getOrder(transaction.orderId)
  }

  onPageChange(pageChange: 'next' | 'previous') {
    if (pageChange === 'next') {
      this.getTransactionsNext()
    } else {
      this.getTransactionsPrevious()
    }
  }

  onPageSizeChange(sizeChange: number) {
    this.size = sizeChange
    this.page = 1
    this.getTransactions(this.page, this.size)
  }

  getTransactionsNext(): void {
    this.page = this.page + 1;
    this.getTransactions(this.page, this.size);
  }

  getTransactionsPrevious(): void {
    this.page = this.page - 1;
    this.getTransactions(this.page, this.size);
  }

  getTransactions(page: number, size: number): void {
    this.loading = true;
    this.paymentService.getTransactions({page, size}).pipe(
      tap(() => this.loading = false),
    ).subscribe((transactionResponse) => {
      this.transactionResponse = transactionResponse
      this.transactions = [...transactionResponse.items]
    })
  }

  getOrder(orderId: number) {
    this.orderService.getOrderById(orderId).subscribe(order => this.relatedOrder = order)
  }

  protected readonly SortField = SortField;
  protected readonly Array = Array;
}
