import {
  faCheck,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FileUploadModel, FileUploadStatus, FileViewModel } from '../models';
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

export const selectFilesReadyForUpload = createSelector(
  selectAllFileUploads,
  (allUploads: FileUploadModel[]) =>
    allUploads && allUploads.filter(f => f.status === FileUploadStatus.Ready)
);

const getFileViewModelIcon = (fileStatus: FileUploadStatus) => {
  switch (fileStatus) {
    case FileUploadStatus.Completed:
      return faCheck;
    case FileUploadStatus.Failed:
      return faExclamationCircle;
    default:
      return null;
  }
};

const getFileViewModelColorClass = (fileStatus: FileUploadStatus) => {
  switch (fileStatus) {
    case FileUploadStatus.Completed:
      return 'green';
    case FileUploadStatus.Failed:
      return 'red';
    default:
      return 'black';
  }
};

const getFormattedFileSize = (fileSize: number) => {
  if (fileSize && !isNaN(fileSize)) {
    const fileSizeInKB = Math.round(fileSize / 1024);
    return `${fileSizeInKB} KB`;
  }
  return `${fileSize}`;
};

const getFileViewModel = (file: FileUploadModel): FileViewModel => ({
  id: file.id,
  fileName: file.fileName,
  formattedFileSize: getFormattedFileSize(file.fileSize),
  canRetry: file.status === FileUploadStatus.Failed,
  canDelete: file.status !== FileUploadStatus.Completed,
  statusIcon: getFileViewModelIcon(file.status),
  statusColorClass: getFileViewModelColorClass(file.status),
  showProgress:
    file.status === FileUploadStatus.InProgress &&
    file.progress &&
    file.progress >= 0,
  progress: file.progress,
  errorMessage: file.status === FileUploadStatus.Failed && file.error
});

export const selectFileUploadQueue = createSelector(
  selectAllFileUploads,
  files => files && files.map(file => getFileViewModel(file))
);
