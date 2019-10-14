import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
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
import * as FileUploadHTTPActions from './file-upload-http.actions';
import * as FileUploadUIActions from './file-upload-ui.actions';
import * as FileUploadSelectors from './file-upload.selectors';

@Injectable()
export class FileUploadEffects {
  constructor(
    private fileUploadService: FileUploadService,
    private actions$: Actions,
    private store$: Store<{}>
  ) {}

  processQueueEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FileUploadUIActions.processQueue, FileUploadUIActions.retryUpload),
      withLatestFrom(
        this.store$.pipe(select(FileUploadSelectors.selectFilesReadyForUpload))
      ),
      switchMap(([_, filesToUpload]) =>
        filesToUpload.map(fileToUpload =>
          FileUploadAPIActions.uploadRequest({ fileToUpload })
        )
      )
    )
  );

  uploadEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FileUploadAPIActions.uploadRequest),
      mergeMap(({ fileToUpload }) =>
        this.fileUploadService.uploadFile(fileToUpload.rawFile).pipe(
          takeUntil(
            this.actions$.pipe(ofType(FileUploadUIActions.cancelUpload))
          ),
          map(event => this.mapActionToHttpStatusEvent(fileToUpload.id, event)),
          catchError(error =>
            of(
              FileUploadAPIActions.uploadFailure({
                error: error.message,
                id: fileToUpload.id
              })
            )
          )
        )
      )
    )
  );

  // uploadWithErrorEffect$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(FileUploadAPIActions.uploadRequest),
  //     mergeMap(({ fileToUpload }) =>
  //       this.fileUploadService.uploadFileError(fileToUpload.rawFile).pipe(
  //         takeUntil(
  //           this.actions$.pipe(ofType(FileUploadUIActions.cancelUpload))
  //         ),
  //         map(event => this.mapActionToHttpStatusEvent(fileToUpload.id, event)),
  //         catchError(error =>
  //           of(
  //             FileUploadAPIActions.uploadFailure({
  //               error: error.message,
  //               id: fileToUpload.id
  //             })
  //           )
  //         )
  //       )
  //     )
  //   )
  // );

  private mapActionToHttpStatusEvent(id: number, event: HttpEvent<any>) {
    const eventToActionMap = {
      [HttpEventType.Sent]: FileUploadHTTPActions.httpSentEvent,
      [HttpEventType.UploadProgress]:
        FileUploadHTTPActions.httpEventUploadProgressEvent,
      [HttpEventType.Response]: FileUploadHTTPActions.httpResponseEvent
    };

    const httpEventActionCreator = eventToActionMap[event.type];

    return httpEventActionCreator({ id, event });
  }
}
