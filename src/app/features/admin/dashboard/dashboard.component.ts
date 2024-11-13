import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {Chart, ChartData, ChartOptions, registerables} from "chart.js";
import {PaymentService} from "../../../services/payment.service";
import {forkJoin} from "rxjs";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";

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

  // Register all Chart.js components
  constructor(
    private paymentService: PaymentService,
    private translate: TranslateService,
  ) {
    this.translate.setDefaultLang("vi")
  }

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

  ngOnInit(): void {
    this.getSaleReportData();
  }

  updateChartData(comparisonType: string): void {
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
