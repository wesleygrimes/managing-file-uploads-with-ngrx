import { Component } from '@angular/core';
import { faTrashAlt, faUndo } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  fileUploadQueue$ = of([]); // f1

  faTrashAlt = faTrashAlt;
  faUndo = faUndo;

  constructor(private store: Store<{}>) {}

  onFileChange(event) {} // f2

  removeFileFromQueue(id: number) {} // f3

  retryUpload(id: number) {} // f4

  cancelUpload() {} // f5

  uploadFiles() {} // f6

  clearFiles() {} // f7
}
