import { createAction, props } from '@ngrx/store';

export const added = createAction(
  '[Upload Form] Added',
  props<{ file: File }>()
);

export const removed = createAction(
  '[Upload Form] Removed',
  props<{ id: string }>()
);

export const processRequested = createAction('[Upload Form] Process Requested');

export const cancelRequested = createAction('[Upload Form] Cancel Requested');

export const retryRequested = createAction(
  '[Upload Form] Retry Requested',
  props<{ id: string }>()
);
