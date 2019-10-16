import { createAction, props } from '@ngrx/store';

export const add = createAction('[Upload Form] Add', props<{ file: File }>());
export const retry = createAction(
  '[Upload Form] Retry',
  props<{ id: string }>()
);
export const remove = createAction(
  '[Upload Form] Remove',
  props<{ id: string }>()
);
export const process = createAction('[Upload Form] Process');
export const clear = createAction('[Upload Form] Clear');
export const cancel = createAction('[Upload Form] Cancel');
