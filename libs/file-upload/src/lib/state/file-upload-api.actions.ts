import { createAction, props } from '@ngrx/store';

export const uploadFailure = createAction(
  '[File Upload Api] Upload Failure',
  props<{ id: number; error: string }>()
);
