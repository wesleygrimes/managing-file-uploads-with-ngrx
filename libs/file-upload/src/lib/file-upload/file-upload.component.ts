import { Component } from '@angular/core';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { FileUploadSelectors, FileUploadUIActions } from '../state';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  filesInQueue$ = this.store.select(FileUploadSelectors.selectFileUploadQueue);

  faUndo = faUndo;

  constructor(private store: Store<{}>) {}

  onFileChange(event) {
    const files: File[] = event.target.files ? [...event.target.files] : [];

    files.forEach(file =>
      this.store.dispatch(FileUploadUIActions.added({ file }))
    );

    event.target.value = '';
  }

  retryUpload(id: string) {
    this.store.dispatch(FileUploadUIActions.retryRequested({ id }));
  }

  cancelUpload() {
    this.store.dispatch(FileUploadUIActions.cancelRequested());
  }

  uploadFiles() {
    this.store.dispatch(FileUploadUIActions.processRequested());
  }
}
