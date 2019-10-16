import { FileUploadStatus } from './file-upload-status';
export interface FileUploadModel {
  id: string;
  fileName: string;
  fileSize: number;
  rawFile: File;
  progress: number;
  status: FileUploadStatus;
  error: string;
}

export interface FileUploadState {
  ids: string[];
  entities: { [id: string]: FileUploadModel };
}
