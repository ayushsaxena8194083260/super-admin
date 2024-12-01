import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FileDownloadService {
  constructor(private http: HttpClient) {}

  downloadFile(url: string,fileName:string): void {
    this.http
      .get(url, { responseType: 'arraybuffer' })
      .subscribe((response) => {
        this.saveFile(response,fileName);
      });
  }

  private saveFile(data: ArrayBuffer,fileName:string): void {
    const blob = new Blob([data]);
    const url = window.URL.createObjectURL(blob);

    // Create a link element and click it to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName + '.xlsx';
    document.body.appendChild(link);
    link.click();

    // Clean up resources
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
