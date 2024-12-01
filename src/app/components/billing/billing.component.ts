import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/bonus.service';
import { FileDownloadService } from 'src/app/services/file-download.service';
import { FooterComponent } from '../footer/footer.component';
import { MaterialModel } from 'src/app/material/material.model';
import { DialogComponentComponent } from '../dialog-component/dialog-component.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FooterComponent,
    MaterialModel,
    NgxSpinnerModule,
  ],
})
export class BillingComponent {
  displayedColumns: string[] = [
    'user_id',
    'parent_id',
    'txn_date',
    'txn_id',
    'status',
    'total_debit',
    'margin_debit',
    'NUAF_debit',
    'total_credit',
    'MVP_credit',
    'referral_credit',
    'community_credit',
    'type',
    'is_flag',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  clientId = localStorage.getItem('clientID');
  token = localStorage.getItem('token');
  filterList = ['BOTH', 'DEBIT', 'CREDIT'];
  filterType!: '';
  public referalsList: any;
  itemsPerPage: number = 25;
  currentPage: number = 1;
  totalItems: number = 100;
  inputValue: string = '';
  fromDate: string = '';
  toDate: string = '';
  transType!: string;
  reason!: string;
  selected = 'option2';
  id!: number;
  dataSource!: MatTableDataSource<any>;
  pageSizeOptions: number[] = [25, 50, 100];
  element: any;
  constructor(
    private readonly apiService: ApiService,
    private readonly spinner: NgxSpinnerService,
    private readonly fileService: FileDownloadService,
    public readonly dialog: MatDialog,
    private readonly toaster: ToastrService
  ) {}

  public ngOnInit(): void {
    this.getBilling();
  }

  getBilling() {
    const req = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      search: this.inputValue,
      from_date: this.toDate,
      to_date: this.fromDate,
      type: this.filterType,
      client_id : this.clientId
    };
    this.spinner.show();
    this.apiService.makeApiRequest('POST', 'billing', req, {}, this.token).subscribe((res) => {
      if (res.status == 200) {
        this.spinner.hide();
        this.dataSource = new MatTableDataSource(res.data.result);
        // this.itemsPerPage = this.pageSizeOptions[0];
        this.dataSource.sort = this.sort;
        this.totalItems = res.data.total;
      } else {
        this.spinner.hide();
        this.toaster.error(res.message);
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.getBilling();
  }

  applyFilter() {
    this.currentPage = 1;
    this.getBilling();
    this.paginator.pageIndex = 0;
  }
  getelementID(ID: number) {
    this.id = ID;
  }

  downloadFile(): void {
    const req = {
      from_date: this.fromDate,
      to_date: this.toDate,
    };
    this.spinner.show();
    this.apiService
      .makeApiRequest('POST', 'downloadBilling', req, {}, this.token)
      .subscribe((res) => {
        if (res) {
          this.spinner.hide();
          this.fileService.downloadFile(res.message, 'BillingFile');
        }
      });
  }

  raiseFlag(): void {
    const req = {
      id: this.id,
      resason: this.reason,
    };
    this.spinner.show();
    this.apiService
      .makeApiRequest('POST', 'raiseFlag', req, {}, this.token)
      .subscribe((res) => {
        if (res) {
          this.spinner.hide();
          this.getBilling();
        }
      });
  }
  onSortChange(event: Sort): void {
    if (event.active === 'id') {
      const sortDirection = event.direction === 'asc' ? 'desc' : 'asc';
      const sortColumn = event.active;
      const sortString = sortDirection;
      const req = {
        page: this.currentPage,
        limit: this.itemsPerPage,
        search: this.inputValue,
        client_id : this.clientId,
        parentSort: sortString,
      };
      this.spinner.show();
      this.apiService
        .makeApiRequest('POST', 'billing', req, {}, this.token)
        .subscribe((res) => {
          if (res) {
            this.spinner.hide();
            this.dataSource = res.data.result;
            this.totalItems = res.data.totalItems;
          }
        });
    }
  }
  clearFilter() {
    this.currentPage = 1;
    this.inputValue = '';
    this.toDate = '';
    this.fromDate = '';
    this.filterType = '';
    this.getBilling();
  }

  // Function to open the dialog
  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    const dialogRef = this.dialog.open(DialogComponentComponent, {
      width: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {}, // You can pass data if needed
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog was closed');
    });
  }
}
