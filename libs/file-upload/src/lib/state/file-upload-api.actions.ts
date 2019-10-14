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
