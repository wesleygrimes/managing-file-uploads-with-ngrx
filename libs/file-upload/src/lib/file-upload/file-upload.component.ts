import { Component } from '@angular/core';
import { faTrashAlt, faUndo } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { FileUploadSelectors, FileUploadUIActions } from '../state';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  fileUploadQueue$ = this.store.select(
    FileUploadSelectors.selectFileUploadQueue
  );

  faTrashAlt = faTrashAlt;
  faUndo = faUndo;

  constructor(private store: Store<{}>) {}

  onFileChange(event) {
    const files: File[] = event.target.files ? [...event.target.files] : [];

    files.forEach(file =>
      this.store.dispatch(FileUploadUIActions.enqueueFile({ file }))
    );

    event.target.value = '';
  }

  removeFileFromQueue(id: number) {
    this.store.dispatch(FileUploadUIActions.removeFileFromQueue({ id }));
  }

  retryUpload(id: number) {
    this.store.dispatch(FileUploadUIActions.retryUpload({ id }));
  }

  cancelUpload() {
    this.store.dispatch(FileUploadUIActions.cancelUpload());
  }

  uploadFiles() {
    this.store.dispatch(FileUploadUIActions.processQueue());
  }

  clearFiles() {
    this.store.dispatch(FileUploadUIActions.clearQueue());
  }
}
