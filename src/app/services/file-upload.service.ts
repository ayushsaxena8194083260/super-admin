// file-upload.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  constructor(private http: HttpClient) { }

  uploadFile(file: File) {
    const formData: FormData = new FormData();
    formData.append('files', file, file.name);
    return this.http.post(`${environment.baseUrl}/uploadFile`, formData);
  }
}
