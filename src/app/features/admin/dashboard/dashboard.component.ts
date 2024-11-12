import {Component, OnInit} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {Chart, ChartData, ChartOptions, registerables} from "chart.js";

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
  // Register all Chart.js components
  constructor() {
    Chart.register(...registerables);
  }

  // Available comparison types
  comparisonTypes = ['Daily', 'Weekly', 'Monthly', 'Quarterly'];
  selectedComparison: string = 'Monthly';

  // Labels and data for the sales chart
  salesLabels: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  salesData: ChartData<'bar'> = {
    labels: this.salesLabels,
    datasets: [
      {
        data: [150, 200, 170, 140, 180, 220, 210, 230, 190, 210, 240, 260],
        label: 'This Year',
        backgroundColor: '#4285f4',
        borderColor: '#4285f4'
      },
      {
        data: [130, 180, 160, 130, 170, 210, 200, 220, 180, 200, 230, 250],
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
        title: {
          display: true,
          text: 'Periods'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sales'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top'
      },
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
}
