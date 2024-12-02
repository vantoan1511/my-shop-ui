import {Component, OnInit} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DataTableFooterComponent} from "../../../shared/components/pagination/pagination.component";
import {PagedResponse} from "../../../types/response.type";
import {Order, OrderDetail, OrderStatus, StatusTransition} from "../../../types/order.type";
import {OrderService} from "../../../services/order.service";
import {CurrencyPipe, DatePipe, NgClass, NgTemplateOutlet} from "@angular/common";
import {Sort, SortField} from "../../../types/sort.type";
import {SortableDirective} from "../../../directives/sortable.directive";
import {TruncatePipe} from "../../../shared/pipes/truncate.pipe";
import {FormsModule} from "@angular/forms";
import {AlertService} from "../../../services/alert.service";
import {RouterLink} from "@angular/router";
import {TableSkeletonComponent} from "../../../components/table-skeleton/table-skeleton.component";

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
    TruncatePipe,
    FormsModule,
    RouterLink,
    TableSkeletonComponent
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  loading = true
  orderResponse: PagedResponse<Order> | null = null;
  orders: Order[] = []
  orderDetails: Map<number, OrderDetail[]> = new Map()
  page = 0;
  size = 20;
  sortBy = SortField.CREATED_AT
  ascending = false;

  selectedOrder: Order | null = null;
  selectedOrderStatus: string | null = null;
  selectedStatus = 'ALL'

  constructor(
    private translateService: TranslateService,
    private orderService: OrderService,
    private alertService: AlertService,
  ) {
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
    this.selectedOrderStatus = selectedOrder.orderStatus;
    this.fetchOrderDetails(selectedOrder.id)
  }

  onChangeOrderStatus(status: string | null = null) {
    if (status && this.selectedOrder) {
      this.orderService.changeOrderStatus(status, this.selectedOrder?.id).subscribe({
        next: () => {
          this.alertService.showSuccessToast("Updated order status successfully")
          if (this.selectedOrder) {
            this.selectedOrder.orderStatus = status
          }
        },
        error: () => {
          this.alertService.showErrorToast("Failed to update order status")
        }
      })
    }
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

  fetchOrderDetails(orderId: number) {
    this.orderService.getOrderById(orderId).subscribe({
      next: (order) => {
        const orderDetails = order.orderDetails ?? []
        this.orderDetails.set(orderId, [...orderDetails])
      }
    })
  }

  canTransitionTo(status: string) {
    const currentStatus = this.selectedOrder?.orderStatus;
    if (currentStatus) {
      const orderStatus = status as OrderStatus;
      const allowedTransition = StatusTransition.get(orderStatus)
      return allowedTransition ? allowedTransition.includes(currentStatus as OrderStatus) : false;
    }
    return false;
  }

  protected readonly Array = Array;
  protected readonly sortableFields = SortField;
  protected readonly SortField = SortField;
  protected readonly ORDER_STATUS = OrderStatus;
  protected readonly Object = Object;
  protected readonly console = console;
}
