import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { IconSetService } from '@coreui/icons-angular';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragAndDropComponent } from './drag-and-drop.component';
import { DragAndDropDirective } from '../Directive/dragAndDrop.directive';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

// const APP_CONTAINERS = [
//   DefaultLayoutComponent
// ];
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    DragAndDropComponent,
    DragAndDropDirective
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    IconSetService,
  ],
  exports: [
    DragAndDropComponent,
    DragAndDropDirective]
})
export class DragAndDropModule { }
