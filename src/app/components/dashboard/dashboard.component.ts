import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/bonus.service';
import { FooterComponent } from '../footer/footer.component';
import { HttpClient } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [FooterComponent, BaseChartDirective, CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule, MatFormFieldModule,
    MatSelectModule],
  providers: [ApiService, HttpClient],
})
export class DashboardComponent {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  dasboardData: any;
  totalSale: any;
  totalUsers: any;
  totalOrders: any;
  activeReferralUsers: any;
  avgOrderValue: any;
  topSellingProduct: any;
  averageUserRewardPointsAllocated: any;
  public barChartLegend = true;
  public barChartPlugins = [];
  token = localStorage.getItem('token');
  clientId = localStorage.getItem('clientID');

  public ChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Sales',
        type: 'bar',
        borderColor: 'black',
        backgroundColor: '#537895',
      },
    ],
  };

  public baChartData: ChartConfiguration<'bar'>['data'] = {
    datasets: [],
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };
  public lineChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    aspectRatio: 2,
  };
  public lineChartLegend = true;
  clients: any[] = [];
  public dashboardForm!: FormGroup;
  constructor(
    private readonly apiService: ApiService,
    private readonly spinner: NgxSpinnerService,
    private readonly cdr: ChangeDetectorRef,
    private readonly formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    const selectedClientId = localStorage.getItem('clientID') || '';
    this.dashboardForm = this.formBuilder.group({
      client: [selectedClientId, Validators.required]
    });
console.log(this.dashboardForm.value)

    this.getDashboardData();
    this.fetchClients();
  }

  getDashboardData() {
    const req = {
      client_id: this.clientId
    }
    this.spinner.show();
    this.apiService.makeApiRequest('POST', 'dashboard', req, {}, this.token).subscribe((res) => {
      if (res) {
        this.spinner.hide();
        this.dasboardData = res.data;
        const char1keys = [];
        const chart1values = [];
        const char2keys = [];
        const chart2values = [];

        for (const item of res.data.pieChart1) {
          const key = Object.keys(item)[0];
          const value = item[key];

          char1keys.push(key);
          chart1values.push(value);
        }
        for (const item of res.data.pieChart2) {
          const key = Object.keys(item)[0];
          const value = item[key];
          char2keys.push(key);
          chart2values.push(value);
        }
        this.chartValues(res);
        this.baChartData = {
          labels: ['Debit', 'Credit'],
          datasets: [
            {
              data: chart2values,
              label: 'Transaction',
              borderColor: 'black',
              backgroundColor: '#537895',
            },
          ],
        };
        this.baChartData.labels = char2keys;
        this.baChartData.datasets[0].data = chart2values;
        this.ChartData.labels = char1keys;
        this.ChartData.datasets[0].data = chart1values;

        this.totalSale = res.data.sales;
        this.totalOrders = res.data.totalOrders;
        this.totalUsers = res.data.totalUsers;
        this.activeReferralUsers = res.data.activeReferralUsers;
        this.avgOrderValue = res.data.avgOrderValue;
        this.averageUserRewardPointsAllocated =
          res.data.averageUserRewardPointsAllocated;
        this.chart.update();
        this.cdr.detectChanges();
      }
    });
  }
  chartValues(res: any) {
    const keys = [] as any;
    const values = [] as any;
    for (const item of res.data.pieChart1) {
      const key = Object.keys(item)[0];
      const value = item[key];

      keys.push(key);
      values.push(value);
    }
  }

  fetchClients(): void {
    const endpoint = 'clientsDropdown';

    this.apiService.makeApiRequest('GET', endpoint).subscribe({
      next: (response) => {
        this.clients = response.data;
      },
      error: (error) => {
        console.error('Error fetching clients:', error);
      }
    });
  }

  onClientChange(event: any): void {
    const selectedClientId = event.value;
    localStorage.setItem('clientID', selectedClientId);
    window.location.reload();
  }
}
