import { createAction, props } from '@ngrx/store';
import { FileUploadModel } from '../models';

export const uploadRequest = createAction(
  '[File Upload Api] Upload Request',
  props<{ fileToUpload: FileUploadModel }>()
);
export const uploadFailure = createAction(
  '[File Upload Api] Upload Failure',
  props<{ id: number; error: string }>()
);
export const uploadStarted = createAction(
  '[File Upload Api] Upload Started',
  props<{ id: number }>()
);
export const uploadProgress = createAction(
  '[File Upload Api] Upload Progress',
  props<{ id: number; progress: number }>()
);
export const uploadCompleted = createAction(
  '[File Upload Api] Upload Complete',
  props<{ id: number }>()
);
