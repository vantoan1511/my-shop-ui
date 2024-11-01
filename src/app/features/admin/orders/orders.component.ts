import {Component, OnInit} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DataTableFooterComponent} from "../../../shared/components/pagination/pagination.component";
import {PagedResponse} from "../../../types/response.type";
import {Order, ORDER_STATUS} from "../../../types/order.type";
import {OrderService} from "../../../services/order.service";
import {CurrencyPipe, DatePipe, NgClass, NgTemplateOutlet} from "@angular/common";
import {Sort, SortField} from "../../../types/sort.type";
import {SortableDirective} from "../../../directives/sortable.directive";
import {TruncatePipe} from "../../../shared/pipes/truncate.pipe";

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    TranslateModule,
    DataTableFooterComponent,
    CurrencyPipe,
    DatePipe,
    NgTemplateOutlet,
    NgClass,
    SortableDirective,
    TruncatePipe
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  loading = true
  orderResponse: PagedResponse<Order> | null = null;
  orders: Order[] = []
  page = 0;
  size = 20;
  sortBy = SortField.CREATED_AT
  ascending = false;

  selectedOrder: Order | null = null;
  selectedStatus = 'ALL'

  constructor(
    private translateService: TranslateService,
    private orderService: OrderService) {
    translateService.setDefaultLang("vi");
  }

  ngOnInit(): void {
    this.fetchOrdersNext();
  }

  onPageChange(pageChange: 'next' | 'previous') {
    if (pageChange === 'next') {
      this.fetchOrdersNext()
    } else {
      this.fetchOrdersPrevious();
    }
  }

  onPageSizeChange(sizeChange: number) {
    this.size = sizeChange;
    this.fetchOrders();
  }

  onSortChange(sort: Sort) {
    if (sort.sortBy) {
      this.sortBy = sort.sortBy;
    }

    this.ascending = sort.ascending ?? this.ascending;

    this.fetchOrders()
  }

  onSelectStatus(status: string) {
    this.selectedStatus = status
    this.page = 1
    this.fetchOrders()
  }

  onClickOnOrder(selectedOrder: Order) {
    this.selectedOrder = selectedOrder;
  }

  fetchOrdersNext() {
    this.page = this.page + 1
    this.fetchOrders();
  }

  fetchOrdersPrevious() {
    this.page = this.page - 1
    this.fetchOrders();
  }

  fetchOrders() {
    this.loading = true;
    const pageRequest = {page: this.page, size: this.size}
    const sort = {sortBy: this.sortBy, ascending: this.ascending}
    const filter = this.selectedStatus === 'ALL' ? {} : {status: this.selectedStatus}
    this.orderService.getOrders(filter, pageRequest, sort).subscribe({
      next: orderResponse => {
        this.orderResponse = orderResponse;
        this.orders = orderResponse.items
        this.loading = false;
      },
      error: () => this.loading = false
    })
  }

  protected readonly Array = Array;
  protected readonly sortableFields = SortField;
  protected readonly SortField = SortField;
  protected readonly ORDER_STATUS = ORDER_STATUS;
  protected readonly Object = Object;
}
