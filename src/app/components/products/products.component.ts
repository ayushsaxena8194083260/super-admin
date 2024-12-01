import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/bonus.service';
import { FileDownloadService } from 'src/app/services/file-download.service';
import { MaterialModel } from 'src/app/material/material.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, MaterialModel, NgxSpinnerModule],
})
export class ProductsComponent {
  displayedColumns: string[] = [
    'product_id',
    'name',
    'price',
    'offer_price',
    'status',
    'margin',
    'mvp_points',
  ];
  Food = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  clientId = localStorage.getItem('clientID');
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<any>;
  public productList: any;
  itemsPerPage: number = 25;
  currentPage: number = 1;
  totalItems: number = 100;
  inputValue: string = '';
  toDate: string = '';
  fromDate: string = '';
  pageSizeOptions: number[] = [25, 50, 100];
  token = localStorage.getItem('token');
  constructor(private readonly apiService: ApiService, private readonly spinner: NgxSpinnerService,
    private readonly toaster: ToastrService
  ) { }

  public ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    const req = {
      client_id: this.clientId,
      page: this.currentPage,
      limit: this.itemsPerPage,
      search: this.inputValue,
      from_date: this.fromDate,
      to_date: this.toDate,
    };
    this.spinner.show();
    this.apiService.makeApiRequest('POST', 'products', req, {}, this.token).subscribe((res) => {
      if (res.status == 200) {
        this.spinner.hide();
        this.dataSource = res.data.products;
        this.totalItems = res.data.totalItems;
      } else {
        this.spinner.hide();
        this.toaster.error(res.message);
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.getProducts();
  }

  applyFilter() {
    this.currentPage = 1;
    this.paginator.pageIndex = 0;
    this.getProducts();
  }

  onSortChange(event: Sort): void {
    if (event.active === 'product_id') {
      const sortDirection = event.direction === 'asc' ? 'desc' : 'asc';

      const sortString = sortDirection;
      const req = {
        page: this.currentPage,
        limit: this.itemsPerPage,
        search: this.inputValue,
        from_date: this.fromDate,
        to_date: this.toDate,
        client_id: this.clientId,
        parentSort: sortString
      };
      this.spinner.show();
      this.apiService.makeApiRequest('POST', 'products', req, {}, this.token).subscribe((res) => {
        if (res) {
          this.spinner.hide();
          this.dataSource = res.data.products;
          this.totalItems = res.data.totalItems;
        }
      });
    }
  }
}
