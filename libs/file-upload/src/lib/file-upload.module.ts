import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileSizePipe } from './pipes';
import { FileUploadEffects, fileUploadFeatureKey, reducer } from './state';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgbProgressbarModule,
    StoreModule.forFeature(fileUploadFeatureKey, reducer),
    EffectsModule.forFeature([FileUploadEffects])
  ],
  declarations: [FileUploadComponent, FileSizePipe],
  exports: [FileUploadComponent]
})
export class FileUploadModule {}
