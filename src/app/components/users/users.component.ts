import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/bonus.service';
import { FooterComponent } from '../footer/footer.component';
import { MaterialModel } from 'src/app/material/material.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports:[CommonModule,FormsModule,FooterComponent,MaterialModel,NgxSpinnerModule]
})
export class UsersComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'user_id',
    'name',
    'email',
    'phone_no',
    'age',
    'created_at',
    'client_id',
    'parent_id',
    'status',
  ];
  public userList: any;
  userId = 45;
  itemsPerPage: number = 25;
  currentPage: number = 1;
  totalItems: number = 100;
  inputValue!: string;
  pageSizeOptions: number[] = [25, 50, 100];
  dataSource!: MatTableDataSource<any>;
  sortKey: any;
  token = localStorage.getItem('token');
  clientId = localStorage.getItem('clientID');
  constructor(private apiService: ApiService, private spinner: NgxSpinnerService) { }
  public ngOnInit(): void {
    this.getUserReq();
  }

  getUserReq() {
    const req = {
      search: this.inputValue,
      page: this.currentPage,
      limit: this.itemsPerPage,
    };
    this.getUsers(req);
  }

  getUsers(req: any) {
    this.spinner.show();
    this.apiService.makeApiRequest('POST', 'users', req, {}, this.token).subscribe((res) => {
      if (res) {
        this.spinner.hide();
        this.dataSource = res.data.users;
        this.totalItems = res.data.totalItems;

      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.getUserReq();
  }
  applyFilter() {
    this.currentPage = 1;
    this.paginator.pageIndex = 0;
    this.getUserReq();
  }
  onSortChange(event: Sort): void {
    if (event.active === 'parent_id' || 'status') {
      const sortDirection = event.direction === 'asc' ? 'desc' : 'asc';

      const sortString = sortDirection;
      let req: any
      req = {
        page: this.currentPage,
        limit: this.itemsPerPage,
        search: this.inputValue,
        parentSort: sortString,
      };
      this.getUsers(req);
    }
  }

}

