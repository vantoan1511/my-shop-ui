import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {Chart, ChartData, ChartOptions, registerables} from "chart.js";
import {PaymentService} from "../../../services/payment.service";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    BaseChartDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  // Register all Chart.js components
  constructor(
    private paymentService: PaymentService,
  ) {
    Chart.register(...registerables);
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
        label: 'This Year',
        backgroundColor: '#4285f4',
        borderColor: '#4285f4'
      },
      {
        data: [],
        label: 'Last Year',
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
        title: {display: true, text: 'Products'}
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
    // this.updateChartData(this.selectedComparison);
    this.getSaleReportData();
  }

  // Method to update chart data based on the selected comparison
  updateChartData(comparisonType: string): void {
    this.selectedComparison = comparisonType;

    switch (comparisonType) {
      case 'Daily':
        this.salesData.datasets[0].data = [5, 10, 8, 12];
        this.salesData.datasets[1].data = [4, 9, 7, 11];
        break;
      case 'Weekly':
        this.salesData.datasets[0].data = [35, 50, 45, 55];
        this.salesData.datasets[1].data = [30, 40, 43, 50];
        break;
      case 'Monthly':
        this.salesData.datasets[0].data = [150, 200, 170, 140];
        this.salesData.datasets[1].data = [120, 180, 160, 130];
        break;
      case 'Quarterly':
        this.salesData.datasets[0].data = [450, 600, 510, 420];
        this.salesData.datasets[1].data = [400, 550, 480, 410];
        break;
      default:
        break;
    }
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
