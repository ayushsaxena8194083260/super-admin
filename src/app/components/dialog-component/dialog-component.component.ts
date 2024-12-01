import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/bonus.service';
import { FileDownloadService } from 'src/app/services/file-download.service';

@Component({
  selector: 'app-dialog-component',
  standalone: true,
  imports: [MatDialogModule, CommonModule, FormsModule],
  templateUrl: './dialog-component.component.html',
  styleUrl: './dialog-component.component.scss',
})
export class DialogComponentComponent {
  toDate: string = '';
  fromDate: string = '';
  constructor(
    private readonly dialogRef: MatDialog,
    private readonly apiService: ApiService,
    private readonly spinner: NgxSpinnerService,
    private readonly fileService: FileDownloadService,
    private readonly toaster: ToastrService
  ) {}

  close() {
    this.dialogRef.closeAll();
  }

  downloadFile(): void {
    const req = {
      from_date: this.fromDate,
      to_date: this.toDate,
    };
    this.spinner.show();
    this.apiService
      .makeApiRequest('POST', 'downloadTransaction', req)
      .subscribe((res) => {
        if (res.status == 200) {
          this.spinner.hide();
          this.fileService.downloadFile(res.message, 'TransactionFile');
        } else {
          this.spinner.hide();
          this.toaster.error(res.message);
        }
      });
  }
}