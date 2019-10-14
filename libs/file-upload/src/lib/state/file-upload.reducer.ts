import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { FileUploadModel, FileUploadStatus } from '../models';
import * as FileUploadAPIActions from './file-upload-api.actions';
import * as FileUploadHTTPActions from './file-upload-http.actions';
import * as FileUploadUIActions from './file-upload-ui.actions';

export interface FileUploadState extends EntityState<FileUploadModel> {
  loaded: boolean;
  error: string;
}

export const fileUploadFeatureKey = 'fileUpload';

export const featureAdapter = createEntityAdapter<FileUploadModel>({
  selectId: (model: FileUploadModel) => model.id
});

export const initialState: FileUploadState = featureAdapter.getInitialState({
  loaded: false,
  error: ''
});

const fileUploadReducer = createReducer(
  initialState,
  on(FileUploadUIActions.enqueueFile, (state, { file }) =>
    featureAdapter.addOne(
      {
        id: Date.now(),
        fileName: file.name,
        fileSize: file.size,
        rawFile: file,
        error: null,
        progress: null,
        status: FileUploadStatus.Ready
      },
      state
    )
  ),
  on(FileUploadUIActions.clearQueue, state =>
    featureAdapter.removeAll({ ...state })
  ),
  on(FileUploadUIActions.removeFileFromQueue, (state, { id }) =>
    featureAdapter.removeOne(id, state)
  ),
  on(FileUploadUIActions.uploadRequest, (state, { fileToUpload }) =>
    featureAdapter.updateOne(
      { id: fileToUpload.id, changes: { status: FileUploadStatus.Requested } },
      state
    )
  ),
  on(FileUploadUIActions.cancelUpload, _ => ({
    ...initialState
  })),
  on(FileUploadUIActions.retryUpload, (state, { id }) =>
    featureAdapter.updateOne(
      {
        id,
        changes: {
          status: FileUploadStatus.Ready,
          progress: 0,
          error: null
        }
      },
      state
    )
  ),
  on(FileUploadHTTPActions.httpSentEvent, (state, { id }) =>
    featureAdapter.updateOne(
      { id: id, changes: { status: FileUploadStatus.Started, progress: 0 } },
      state
    )
  ),
  on(
    FileUploadHTTPActions.httpEventDownloadProgressEvent,
    FileUploadHTTPActions.httpEventUploadProgressEvent,
    (state, { id, event }) =>
      featureAdapter.updateOne(
        {
          id: id,
          changes: {
            status: FileUploadStatus.InProgress,
            progress: Math.round((100 * event.loaded) / event.total)
          }
        },
        state
      )
  ),
  on(
    FileUploadHTTPActions.httpResponseEvent,
    FileUploadHTTPActions.httpResponseHeaderEvent,
    (state, { id, event }) => {
      if (event.status === 200) {
        return featureAdapter.updateOne(
          {
            id,
            changes: { status: FileUploadStatus.Completed, progress: 100 }
          },
          state
        );
      } else {
        return featureAdapter.updateOne(
          {
            id,
            changes: {
              status: FileUploadStatus.Failed,
              progress: null,
              error: event.statusText
            }
          },
          state
        );
      }
    }
  ),
  on(FileUploadAPIActions.uploadFailure, (state, { id, error }) =>
    featureAdapter.updateOne(
      {
        id,
        changes: { status: FileUploadStatus.Failed, progress: null, error }
      },
      state
    )
  )
);

export function reducer(state: FileUploadState | undefined, action: Action) {
  return fileUploadReducer(state, action);
}
