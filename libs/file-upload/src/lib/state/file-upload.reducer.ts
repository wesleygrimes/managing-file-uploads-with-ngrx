import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as uuid from 'uuid';
import { FileUploadModel, FileUploadStatus } from '../models';
import * as FileUploadAPIActions from './file-upload-api.actions';
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
        id: uuid.v4(),
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
  on(FileUploadAPIActions.uploadRequest, (state, { fileToUpload }) =>
    featureAdapter.updateOne(
      { id: fileToUpload.id, changes: { status: FileUploadStatus.Requested } },
      state
    )
  ),
  on(FileUploadAPIActions.uploadStarted, (state, { id }) =>
    featureAdapter.updateOne(
      { id: id, changes: { status: FileUploadStatus.Started, progress: 0 } },
      state
    )
  ),
  on(FileUploadAPIActions.uploadProgress, (state, { id, progress }) =>
    featureAdapter.updateOne(
      {
        id: id,
        changes: { status: FileUploadStatus.InProgress, progress: progress }
      },
      state
    )
  ),
  on(FileUploadAPIActions.uploadCompleted, (state, { id }) =>
    featureAdapter.updateOne(
      {
        id: id,
        changes: { status: FileUploadStatus.Completed, progress: 100 }
      },
      state
    )
  ),
  on(FileUploadAPIActions.uploadFailure, (state, { id, error }) =>
    featureAdapter.updateOne(
      {
        id: id,
        changes: {
          status: FileUploadStatus.Failed,
          progress: null,
          error
        }
      },
      state
    )
  ),
  on(FileUploadUIActions.cancelUpload, _ => ({
    ...initialState
  }))
);

export function reducer(state: FileUploadState | undefined, action: Action) {
  return fileUploadReducer(state, action);
}
