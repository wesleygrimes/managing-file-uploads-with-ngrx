import {
  HttpDownloadProgressEvent,
  HttpHeaderResponse,
  HttpResponse,
  HttpSentEvent,
  HttpUploadProgressEvent
} from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

export const httpSentEvent = createAction(
  '[File Upload Api] HTTP Sent Event',
  props<{ id: number; event: HttpSentEvent }>()
);
export const httpEventDownloadProgressEvent = createAction(
  '[File Upload Api] HTTP Download Progress Event',
  props<{ id: number; event: HttpDownloadProgressEvent }>()
);
export const httpEventUploadProgressEvent = createAction(
  '[File Upload Api] HTTP Upload Progress Event',
  props<{ id: number; event: HttpUploadProgressEvent }>()
);
export const httpResponseEvent = createAction(
  '[File Upload Api] HTTP Response Event',
  props<{ id: number; event: HttpHeaderResponse }>()
);
export const httpResponseHeaderEvent = createAction(
  '[File Upload Api] HTTP Response Header Event',
  props<{ id: number; event: HttpResponse<any> }>()
);
