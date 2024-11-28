import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {Chart, ChartData, ChartOptions, ChartType} from "chart.js";
import {forkJoin, tap} from "rxjs";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {OrderService} from "../../../services/order.service";
import {ProductService} from "../../../services/product.service";
import {UserService} from "../../../services/user.service";
import {NgClass} from "@angular/common";
import {FormsModule} from "@angular/forms";
import zoomPlugin from 'chartjs-plugin-zoom';
import {PaymentService} from "../../../services/payment.service";
import {ProductStat} from "../../../types/product.type";
import {SkeletonComponent} from "../../../components/skeleton/skeleton.component";
import {TableSkeletonComponent} from "../../../components/table-skeleton/table-skeleton.component";

Chart.register(zoomPlugin)

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    BaseChartDirective,
    TranslateModule,
    RouterLink,
    NgClass,
    FormsModule,
    SkeletonComponent,
    TableSkeletonComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;

  // Available comparison types
  selectedPeriod: 'daily' | 'weekly' | 'monthly' | 'quarterly' = 'monthly';
  thatYear = new Date().getFullYear();
  thisYear = this.thatYear - 1;

  xTitle = 'Thời gian';
  yTitle = 'Doanh số';
  salesLabels: string[] = [];
  salesData: ChartData = {
    labels: this.salesLabels,
    datasets: [
      {
        data: [],
        label: `${this.thisYear}`,
      },
      {
        data: [],
        label: `${this.thatYear}`,
      }
    ]
  };
  salesType: ChartType = 'bar';
  salesOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: this.xTitle
        }
      },
      y: {
        beginAtZero: true,
        title: {display: true, text: this.yTitle,}
      }
    },
    plugins: {
      legend: {position: 'top'},
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`
        }
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'x',
        }
      }
    }
  };

  totalCompletedOrderLoaded = false;
  totalActiveProductLoaded = false;
  totalActiveUserLoaded = false;
  totalTransactionLoaded = false;
  totalCompletedOrders = 0;
  totalActiveProducts = 0;
  totalActiveUsers = 0;
  totalTransactions = 0;

  productStatLoaded = false;
  productStat: ProductStat | null = null;
  productStatType: 'by-brand' | 'by-model' | 'by-category'|'by-status' = 'by-brand'

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private paymentService: PaymentService,
    private translate: TranslateService,
    private userService: UserService
  ) {
    this.translate.setDefaultLang("vi")
  }

  ngOnInit(): void {
    this.getSaleReportData(this.selectedPeriod, this.thisYear, this.thatYear);
    this.getTotalCompletedOrders();
    this.getActiveProducts();
    this.getTotalActiveUsers();
    this.getTotalTransactions();
    this.getProductStat();
  }

  toggleChartType() {
    this.salesType = this.salesType === 'bar' ? 'line' : 'bar';
  }

  refreshChart() {
    console.log("options: ", this.selectedPeriod, this.thisYear, this.thatYear);
    this.getSaleReportData(this.selectedPeriod, this.thisYear, this.thatYear);
  }

  getTotalCompletedOrders() {
    this.orderService.getOrders({}, {page: 1, size: 1}, {}).pipe(
      tap(() => this.totalCompletedOrderLoaded = true)
    ).subscribe(({totalItems}) => this.totalCompletedOrders = totalItems)
  }

  getActiveProducts() {
    this.productService.getProducts({page: 1, size: 1}).pipe(
      tap(() => this.totalActiveProductLoaded = true)
    ).subscribe(({totalItems}) => this.totalActiveProducts = totalItems)
  }

  getTotalActiveUsers() {
    this.userService.getBy({page: 1, size: 1}).pipe(
      tap(() => this.totalActiveUserLoaded = true)
    ).subscribe(({totalItems}) => this.totalActiveUsers = totalItems)
  }

  getTotalTransactions() {
    this.paymentService.getTransactions({page: 1, size: 1}).pipe(
      tap(() => this.totalTransactionLoaded = true)
    ).subscribe(({totalItems}) => this.totalTransactions = totalItems)
  }

  getSaleReportData(period: 'daily' | 'weekly' | 'monthly' | 'quarterly' = 'monthly', thisYear: number, thatYear: number) {
    forkJoin({
      thisYear: this.orderService.getSaleReport({period, year: thisYear}),
      thatYear: this.orderService.getSaleReport({period, year: thatYear})
    }).subscribe({
      next: ({thisYear, thatYear}) => {
        this.salesLabels = thisYear.labels;
        this.salesData.labels = this.salesLabels.map(each => this.translate.instant(each));

        this.salesData.datasets[0].data = thisYear.data;
        this.salesData.datasets[1].data = thatYear.data;
        this.salesData.datasets[0].label = `${thisYear.year}`;
        this.salesData.datasets[1].label = `${thatYear.year}`;

        this.updateCharts()
      },
      error: (err) => {
        console.error('Error fetching sales data', err);
      }
    });
  }

  updateCharts() {
    this.charts.forEach(chart => chart.update())
  }

  getProductStat() {
    this.productStatLoaded = false
    this.productService.getStats()
      .pipe(tap(() => this.productStatLoaded = true))
      .subscribe((stat) => this.productStat = stat)
  }

  get currentYear() {
    return new Date().getFullYear();
  }

  protected readonly Array = Array;
  protected readonly Object = Object;
}
