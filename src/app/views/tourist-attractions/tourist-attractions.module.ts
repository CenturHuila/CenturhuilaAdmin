// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';

// Carousel Component
import { CarouselModule } from 'ngx-bootstrap/carousel';

// Collapse Component
import { CollapseModule } from 'ngx-bootstrap/collapse';

// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';

// Popover Component
import { PopoverModule } from 'ngx-bootstrap/popover';

// Progress Component
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

// Tooltip Component
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CreateTouristAttractionsComponent } from './create-tourist-providers/create-tourist-attractions.component';
import { TouristAttractionsComponent } from './tourist-attractions.component';
import { TouristAttractionsRoutingModule } from './tourist-attractions-routing.module';
import { ImageCropperModalModule } from '../image-cropper/image-cropper.module';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { DragAndDropComponent } from '../dragAndDropImage/dragAndDrop/drag-and-drop.component';
import { DragAndDropDirective } from '../dragAndDropImage/Directive/dragAndDrop.directive';

// Components Routing

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TouristAttractionsRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule,
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    ImageCropperModalModule,
    
    AngularFileUploaderModule,
  ],
  declarations:[CreateTouristAttractionsComponent, TouristAttractionsComponent, DragAndDropComponent,DragAndDropDirective],
  exports: [DragAndDropDirective]
})
export class TouristAttractionsModule { }
