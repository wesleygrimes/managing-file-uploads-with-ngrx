import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  takeUntil,
  withLatestFrom
} from 'rxjs/operators';
import { FileUploadService } from '../services';
import * as FileUploadAPIActions from './file-upload-api.actions';
import * as FileUploadUIActions from './file-upload-ui.actions';
import * as FileUploadSelectors from './file-upload.selectors';

@Injectable()
export class FileUploadEffects {
  constructor(
    private fileUploadService: FileUploadService,
    private actions$: Actions,
    private store: Store<{}>
  ) {}

  processQueueEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FileUploadUIActions.process, FileUploadUIActions.retry),
      withLatestFrom(
        this.store.select(FileUploadSelectors.selectFilesReadyForUpload)
      ),
      switchMap(([_, filesToUpload]) =>
        filesToUpload.map(fileToUpload =>
          FileUploadAPIActions.uploadRequested({ fileToUpload })
        )
      )
    )
  );

  // uploadEffect$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(FileUploadAPIActions.uploadRequested),
  //     mergeMap(({ fileToUpload }) =>
  //       this.fileUploadService.uploadFile(fileToUpload.rawFile).pipe(
  //         takeUntil(this.actions$.pipe(ofType(FileUploadUIActions.cancel))),
  //         map(event => this.getActionFromHttpEvent(fileToUpload.id, event)),
  //         catchError(error =>
  //           of(
  //             FileUploadAPIActions.uploadFailed({
  //               error: error.message,
  //               id: fileToUpload.id
  //             })
  //           )
  //         )
  //       )
  //     )
  //   )
  // );

  uploadWithErrorEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FileUploadAPIActions.uploadRequested),
      mergeMap(({ fileToUpload }) =>
        this.fileUploadService.uploadFileError(fileToUpload.rawFile).pipe(
          takeUntil(this.actions$.pipe(ofType(FileUploadUIActions.cancel))),
          map(event => this.getActionFromHttpEvent(fileToUpload.id, event)),
          catchError(error =>
            of(
              FileUploadAPIActions.uploadFailed({
                error: error.message,
                id: fileToUpload.id
              })
            )
          )
        )
      )
    )
  );

  private getActionFromHttpEvent(id: string, event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.Sent: {
        return FileUploadAPIActions.uploadStarted({ id });
      }
      case HttpEventType.DownloadProgress:
      case HttpEventType.UploadProgress: {
        return FileUploadAPIActions.uploadProgressed({
          id,
          progress: Math.round((100 * event.loaded) / event.total)
        });
      }
      case HttpEventType.ResponseHeader:
      case HttpEventType.Response: {
        if (event.status === 200) {
          return FileUploadAPIActions.uploadCompleted({ id });
        } else {
          return FileUploadAPIActions.uploadFailed({
            id,
            error: event.statusText
          });
        }
      }
      default: {
        return FileUploadAPIActions.uploadFailed({
          id,
          error: `Unknown Event: ${JSON.stringify(event)}`
        });
      }
    }
  }
}
