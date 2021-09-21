import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { IconSetService } from '@coreui/icons-angular';
import { DefaultLayoutComponent } from '../../containers';
import { ImageCropperModalComponent } from './image-cropper.component';
import { SafengPipe } from '../../pipes/safeng.pipe';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

const APP_CONTAINERS = [
  DefaultLayoutComponent
];
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ImageCropperModule
  ],
  declarations: [
    SafengPipe,
    ImageCropperModalComponent
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    IconSetService,
  ],
  exports: [ImageCropperModalComponent, ImageCropperModule]
})
export class ImageCropperModalModule { }
