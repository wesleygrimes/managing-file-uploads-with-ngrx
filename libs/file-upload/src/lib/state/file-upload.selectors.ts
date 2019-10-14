import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  FileUploadModel,
  FileUploadStatus
} from '@real-world-app/shared-models';
import {
  featureAdapter,
  fileUploadFeatureKey,
  FileUploadState
} from './file-upload.reducer';

export const selectFileUploadState = createFeatureSelector<FileUploadState>(
  fileUploadFeatureKey
);

export const selectAllFileUploads: (
  state: object
) => FileUploadModel[] = featureAdapter.getSelectors(selectFileUploadState)
  .selectAll;

export const selectFilesInQueue = createSelector(
  selectAllFileUploads,
  (allUploads: FileUploadModel[]) =>
    allUploads && allUploads.filter(f => f.status === FileUploadStatus.Ready)
);
