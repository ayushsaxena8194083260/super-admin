import { Component, ViewChild } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/bonus.service';
import { FileDownloadService } from 'src/app/services/file-download.service';
import { MaterialModel } from 'src/app/material/material.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponentComponent } from '../dialog-component/dialog-component.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FooterComponent,
    MaterialModel,
    NgxSpinnerModule,
  ],
})
export class TransactionComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<any>;

  displayedColumns: string[] = [
    'user_id',
    'purchase_value',
    'points_earned',
    'order_id',
    'txn_date',
    'payment_type',
    'points_used',
  ];
  filterList = ['ALL', 'UPI', 'CARD', 'CASH', 'POINTS'];
  filterType!: '';
  public transactionList: any;
  itemsPerPage: number = 25;
  currentPage: number = 1;
  totalItems: number = 100;
  inputValue!: string;
  toDate: string = '';
  fromDate: string = '';
  pageSizeOptions: number[] = [25, 50, 100];
  clientId = localStorage.getItem('clientID');
  token = localStorage.getItem('token');
  constructor(
    private readonly apiService: ApiService,
    private readonly spinner: NgxSpinnerService,
    private readonly fileService: FileDownloadService,
    public readonly dialog: MatDialog,
    private readonly toaster: ToastrService
  ) {}

  public ngOnInit(): void {
    this.getTransaction();
  }

  getTransaction() {
    const req = {
      userId: this.inputValue,
      page: this.currentPage,
      limit: this.itemsPerPage,
      from_date: this.fromDate,
      to_date: this.toDate,
      paymentType: this.filterType,
      client_id : this.clientId,
    };
    this.spinner.show();
    this.apiService
      .makeApiRequest('POST', 'transactions', req, {}, this.token)
      .subscribe((res) => {
        if (res) {
          this.spinner.hide();
          this.dataSource = new MatTableDataSource(res.data.transactions);
          this.dataSource.sort = this.sort;
          this.totalItems = res.data.totalItems;
        }
      });
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.paginator.pageIndex = 0;
    this.getTransaction();
  }

  applyFilter() {
    this.currentPage = 1;
    this.getTransaction();
  }
  clearFilter() {
    this.currentPage = 1;
    this.getTransaction();
    this.inputValue = '';
    this.toDate = '';
    this.fromDate = '';
    this.filterType = '';
    this.getTransaction();
  }
  downloadFile(): void {
    const req = {
      from_date: this.fromDate,
      to_date: this.toDate,
    };
    this.spinner.show();
    this.apiService
      .makeApiRequest('POST', 'downloadTransaction', req, {}, this.token)
      .subscribe((res) => {
        if (res.status == 200) {
          this.spinner.hide();
          this.fileService.downloadFile(res.message, 'TransactionFile');
        }
        else {
          this.spinner.hide();
          this.toaster.error(res.message);
        }
      });
  }

  onSortChange(event: Sort): void {
    if (event.active === 'id') {
      const sortDirection = event.direction === 'asc' ? 'desc' : 'asc';

      const sortString = sortDirection;
      const req = {
        page: this.currentPage,
        limit: this.itemsPerPage,
        from_date: this.fromDate,
        to_date: this.toDate,
        paymentType: this.filterType,
        parentSort: sortString,
        userId: this.inputValue,
        client_id : this.clientId,
      };
      this.spinner.show();
      this.apiService
        .makeApiRequest('POST', 'transactions', req, {}, this.token)
        .subscribe((res) => {
          if (res) {
            this.spinner.hide();
            this.dataSource = new MatTableDataSource(res.data.transactions);
            this.dataSource.sort = this.sort;
            this.totalItems = res.data.totalItems;
          }
        });
    }
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

    // Handle what happens after the dialog is closed
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog was closed');
    });
  }
}
