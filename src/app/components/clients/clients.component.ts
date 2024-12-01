import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/bonus.service';
import { FileDownloadService } from 'src/app/services/file-download.service';
import { DialogComponentComponent } from '../dialog-component/dialog-component.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { MaterialModel } from 'src/app/material/material.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FooterComponent,
    MaterialModel,
    NgxSpinnerModule,
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})

export class ClientsComponent {
  displayedColumns: string[] = [
    'client_id',
    'name',
    'email',
    'community_cashback',
    'mvp_points',
    'created_date',
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
    private readonly toaster: ToastrService,
    private readonly router : Router
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
    this.apiService.makeApiRequest('POST', 'clients', req, {}, this.token).subscribe((res) => {
      if (res.status == 200) {
        this.spinner.hide();
        this.dataSource = new MatTableDataSource(res.data.clients);
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
        .makeApiRequest('POST', 'clients', req, {}, this.token)
        .subscribe((res) => {
          if (res) {
            this.spinner.hide();
            this.dataSource = res.data.clients;
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

  addClient(){
    this.router.navigate(['/add-client']);
  }
}

