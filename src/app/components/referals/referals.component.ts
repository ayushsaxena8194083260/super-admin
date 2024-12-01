import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/bonus.service';
import { MaterialModel } from 'src/app/material/material.model';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-referals',
  templateUrl: './referals.component.html',
  styleUrls: ['./referals.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, MaterialModel]
})
export class ReferalsComponent {
  displayedColumns: string[] = [
    'parent_id',
    'Name',
    'phone_number',
    'email_id',
    'date_of_referal',
    'status',
    'date_of_mvp',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  clientId = localStorage.getItem('clientID');
  token = localStorage.getItem('token');
  dataSource!: MatTableDataSource<any>;

  public referalsList: any;
  itemsPerPage: number = 25;
  currentPage: number = 1;
  totalItems: number = 100;
  inputValue: string = '';
  toDate: string = '';
  fromDate: string = '';
  pageSizeOptions: number[] = [25, 50, 100];

  constructor(
    private readonly apiService: ApiService,
    private readonly spinner: NgxSpinnerService,
    private readonly toaster: ToastrService
  ) { }

  public ngOnInit(): void {
    this.getReferals();
  }

  getReferals() {
    const req = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      search: this.inputValue,
      client_id: this.clientId
    };
    this.spinner.show();
    this.apiService.makeApiRequest('POST', 'referals', req, {}, this.token).subscribe((res) => {
      if (res.status === 200) {
        this.spinner.hide();
        this.totalItems = res.data.totalItems;
        // this.itemsPerPage = this.pageSizeOptions[0];
        this.dataSource = new MatTableDataSource(res.data.referals);
        console.log(this.dataSource)
        this.dataSource.sort = this.sort;
      } else {
        this.spinner.hide();
        this.toaster.error(res.message);
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.getReferals();
  }

  applyFilter() {
    this.currentPage = 1;
    this.getReferals();
  }

  onSortChange(event: Sort): void {
    if (event.active === 'parent_id') {
      const sortDirection = event.direction === 'asc' ? 'desc' : 'asc';

      const sortString = sortDirection;
      const req = {
        page: this.currentPage,
        limit: this.itemsPerPage,
        search: this.inputValue,
        parentSort: sortString,
        client_id: this.clientId
      };
      this.spinner.show();
      this.apiService.makeApiRequest('POST', 'referals', req, {}, this.token).subscribe((res) => {
        if (res) {
          this.spinner.hide();
          this.dataSource = new MatTableDataSource(res.data.referals);
          this.totalItems = res.data.totalItems;
        }
      });
    }
  }
}
