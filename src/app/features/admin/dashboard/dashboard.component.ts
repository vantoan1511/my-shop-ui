import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {ChartData, ChartOptions} from "chart.js";
import {PaymentService} from "../../../services/payment.service";
import {forkJoin, tap} from "rxjs";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {OrderService} from "../../../services/order.service";
import {ProductService} from "../../../services/product.service";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    BaseChartDirective,
    TranslateModule,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  // Available comparison types
  comparisonTypes = ['Daily', 'Weekly', 'Monthly', 'Quarterly'];
  selectedComparison: string = 'Monthly';

  /// Sales chart configuration
  salesLabels: string[] = [];
  salesData: ChartData<'bar'> = {
    labels: this.salesLabels,
    datasets: [
      {
        data: [],
        label: 'Last year',
        backgroundColor: '#4285f4',
        borderColor: '#4285f4'
      },
      {
        data: [],
        label: 'This year',
        backgroundColor: '#fbbc05',
        borderColor: '#fbbc05'
      }
    ]
  };
  salesType: 'bar' = 'bar';
  salesOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: {
        title: {display: true, text: 'Periods'}
      },
      y: {
        beginAtZero: true,
        title: {display: true, text: 'Sales'}
      }
    },
    plugins: {
      legend: {position: 'top'},
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`
        }
      }
    }
  };

  // Strictly typed chart data and options for revenue
  revenueLabels: string[] = ['January', 'February', 'March', 'April'];
  revenueData: ChartData<'line'> = {
    labels: this.revenueLabels,
    datasets: [
      {data: [1000, 1200, 900, 1500], label: 'Monthly Revenue'}
    ]
  };
  revenueType: 'line' = 'line';
  revenueOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Strictly typed chart data and options for user stats
  userStatsLabels: string[] = ['Active', 'Inactive'];
  userStatsData: ChartData<'pie'> = {
    labels: this.userStatsLabels,
    datasets: [
      {data: [300, 120], label: 'User Status'}
    ]
  };
  userStatsType: 'pie' = 'pie';
  userStatsOptions: ChartOptions<'pie'> = {
    responsive: true
  };

  totalCompletedOrderLoaded = false;
  totalActiveProductLoaded = false;
  totalActiveUserLoaded = false;
  totalTransactionLoaded = false;
  totalCompletedOrders = 0;
  totalActiveProducts = 0;
  totalActiveUsers = 0;
  totalTransactions = 0;

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
    this.getSaleReportData();
    this.getTotalCompletedOrders();
    this.getActiveProducts();
    this.getTotalActiveUsers();
    this.getTotalTransactions();
  }

  getTotalCompletedOrders() {
    this.orderService.getOrders({}, {page: 1, size: 1}, {}).pipe(
      tap(() => this.totalCompletedOrderLoaded = true)
    ).subscribe(({totalItems}) => this.totalCompletedOrders = totalItems)
  }

  getActiveProducts() {
    this.productService.getBy({page: 1, size: 1}).pipe(
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

  getSaleReportData() {
    const currentYear = 2024;
    const lastYear = currentYear - 1;

    forkJoin({
      lastYear: this.paymentService.getSaleReport({period: "monthly", year: lastYear}),
      currentYear: this.paymentService.getSaleReport({period: "monthly", year: currentYear})
    }).subscribe({
      next: ({lastYear, currentYear}) => {
        // Assuming both responses have `labels` and `data`
        this.salesLabels = lastYear.labels; // Use the labels from one of the responses
        this.salesData.labels = this.salesLabels; // Set chart labels

        this.salesData.datasets[0].data = lastYear.data; // Last year's data
        this.salesData.datasets[1].data = currentYear.data; // Current year's data

        // Re-render the chart
        this.chart.update();
      },
      error: (err) => {
        console.error('Error fetching sales data', err);
      }
    });
  }
}
