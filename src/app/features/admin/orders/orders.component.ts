import {Component} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DataTableFooterComponent} from "../../../shared/components/pagination/pagination.component";
import {PagedResponse} from "../../../types/response.type";
import {Order} from "../../../types/order.type";

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    TranslateModule,
    DataTableFooterComponent
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {

  loading = true
  orderResponse: PagedResponse<Order> | null = null;

  constructor(private translateService: TranslateService) {
    translateService.setDefaultLang("vi");
  }

  onPageChange(pageChange: 'next' | 'previous') {

  }

  onPageSizeChange(sizeChange: number) {
  }

  protected readonly Array = Array;
}
