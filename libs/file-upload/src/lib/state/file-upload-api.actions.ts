import { createAction, props } from '@ngrx/store';
import { FileUploadModel } from '../models';

export const uploadRequested = createAction(
  '[Upload Effect] Upload Requested',
  props<{ fileToUpload: FileUploadModel }>()
);
export const uploadFailed = createAction(
  '[Upload API] Upload Failed',
  props<{ id: string; error: string }>()
);
export const uploadStarted = createAction(
  '[Upload API] Upload Started',
  props<{ id: string }>()
);
export const uploadProgressed = createAction(
  '[Upload API] Upload Progressed',
  props<{ id: string; progress: number }>()
);
export const uploadCompleted = createAction(
  '[Upload API] Upload Completed',
  props<{ id: string }>()
);
