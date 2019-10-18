import { Component } from '@angular/core';
import { faTrashAlt, faUndo } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  //f1

  faTrashAlt = faTrashAlt;
  faUndo = faUndo;

  constructor(private store: Store<{}>) {}

  //f2

  //f3

  //f4

  //f5

  //f6

  //f7
}
