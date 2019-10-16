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
      this.store.dispatch(FileUploadUIActions.add({ file }))
    );

    event.target.value = '';
  }

  removeFileFromQueue(id: string) {
    this.store.dispatch(FileUploadUIActions.remove({ id }));
  }

  retryUpload(id: string) {
    this.store.dispatch(FileUploadUIActions.retry({ id }));
  }

  cancelUpload() {
    this.store.dispatch(FileUploadUIActions.cancel());
  }

  uploadFiles() {
    this.store.dispatch(FileUploadUIActions.process());
  }

  clearFiles() {
    this.store.dispatch(FileUploadUIActions.clear());
  }
}
