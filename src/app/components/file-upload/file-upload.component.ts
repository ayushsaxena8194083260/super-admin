import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  selectedFile: File | null = null;

  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly toaster: ToastrService,
    private readonly spinner: NgxSpinnerService
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.onUpload();
  }

  onUpload() {
    if (this.selectedFile) {
      this.spinner.show();
      this.fileUploadService
        .uploadFile(this.selectedFile)
        .subscribe((response) => {
          if (response) {
            this.spinner.hide();
            this.toaster.success('file upload successfully');
          }
        });
    }
  }
}
